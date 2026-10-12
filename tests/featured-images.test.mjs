import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";
function load(file, deps = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, FormData, File, Set, Object, Error, require(name) {
    if (Object.hasOwn(deps, name)) return deps[name];
    throw new Error("Unexpected import: " + name);
  } }, { filename: file });
  return exports;
}
const images = load("lib/site/featured-images.ts");
const key = "project:thesis", traceKey = "trace:trace-getty";
const field = images.featuredImageField(key), traceField = images.featuredImageField(traceKey);

test("home overrides follow stable identity after reordering, keeping detail sources intact", () => {
  const originals = [{slug:"other",coverImageUrl:"original-2"}, {slug:"thesis",coverImageUrl:"original-1"}];
  const changed = images.applyProjectImages(originals, { [key]: "https://media.example.com/new.webp" });
  assert.equal(changed[1].coverImageUrl, "https://media.example.com/new.webp");
  assert.equal(changed[0].coverImageUrl, "original-2");
  assert.equal(originals[1].coverImageUrl, "original-1");
  const traces = [{id:"trace-getty",imageUrl:"photo-original"}, {id:"trace-drawing",imageUrl:"drawing-original"}];
  assert.equal(images.applyTraceImages(traces, { [traceKey]: "photo-new" })[0].imageUrl, "photo-new");
  assert.equal(images.applyTraceImages(traces, {})[0].imageUrl, "photo-original");
});

test("save changes only touched covers, supports a reset and an upload together", async () => {
  const form = new FormData();
  form.set(field + "_reset", "1");
  form.set(traceField + "_upload_receipt", "verified-receipt");
  const changes = await images.collectFeaturedImageChanges(form, [key,traceKey,"project:untouched"],
    async name => name === traceField ? "https://media.example.com/photo.webp" : null);
  assert.equal(JSON.stringify(changes), JSON.stringify([
    {item_key:key,image_url:null}, {item_key:traceKey,image_url:"https://media.example.com/photo.webp"},
  ]));
  assert.equal((await images.collectFeaturedImageChanges(new FormData(), [key], async()=>null)).length, 0);
});

test("unknown or stale targets and conflicting reset/upload are rejected before saving", async () => {
  const stale = new FormData();
  stale.set(images.featuredImageField("project:deleted") + "_reset", "1");
  let read = false;
  await assert.rejects(images.collectFeaturedImageChanges(stale, [key], async()=>{read=true;return null;}), /刷新/);
  assert.equal(read,false);
  const conflict = new FormData(); conflict.set(field + "_reset","1");
  await assert.rejects(images.collectFeaturedImageChanges(conflict,[key],async()=>"https://media.example.com/new.webp"), /同时/);
});

function actionFixture(user = { id: "admin-1", is_anonymous: false, app_metadata: { cms_role: "admin" } }, failure = false) {
  const writes = [], checks = [], invalidated = [];
  const client = { auth: { getUser: async()=>({data:{user}}) }, from(table) {
    return { upsert(payload) {
      writes.push({table,payload});
      return table === "home_featured_images"
        ? { select: async()=>({data:failure?[]:payload.map(row=>({item_key:row.item_key})),error:failure?{message:"denied"}:null}) }
        : Promise.resolve({error:null});
    }};
  }};
  const action = load("app/admin/site/actions.ts", {
    "next/cache": { revalidatePath: value=>invalidated.push(value) },
    "next/navigation": { redirect: value=>{ throw new Error("REDIRECT:" + value); } },
    "@/lib/supabase/server": { createClient: async()=>client },
    "@/lib/projects/queries": { getFeaturedProjects: async()=>[{slug:"thesis"}] },
    "@/lib/traces/queries": { getFeaturedTraces: async()=>[{id:"trace-getty"}] },
    "@/lib/site/featured-images": images,
    "@/lib/media/form-upload": { getFormMediaUrl: async(_client,form,name,scope)=>{
      checks.push({name,scope});
      return form.get(name + "_upload_receipt") ? "https://media.example.com/new.webp" : null;
    }},
  }).updateSiteSettingsAction;
  return {action,writes,checks,invalidated};
}

test("site action saves receipt-only uploads with the new scope and invalidates home/admin", async () => {
  const fixture = actionFixture(), form = new FormData();
  form.set(traceField + "_upload_receipt","receipt");
  await assert.rejects(fixture.action(form), /REDIRECT:\/admin\/site/);
  const saved = fixture.writes.find(item=>item.table==="home_featured_images");
  assert.equal(saved.payload[0].item_key,traceKey);
  assert.ok(fixture.checks.some(item=>item.name===traceField && item.scope==="site-featured"));
  assert.ok(fixture.invalidated.includes("/") && fixture.invalidated.includes("/admin/site"));
});

test("site action reports failed cover writes and rejects non-admin / anonymous users", async () => {
  const failed = actionFixture(undefined, true), form = new FormData();
  form.set(field + "_reset","1");
  await assert.rejects(failed.action(form), /首页展示图保存失败/);
  assert.equal(failed.writes.length,1);
  assert.equal(failed.invalidated.length,0);
  for (const user of [
    {id:"member",app_metadata:{}},
    {id:"anonymous",is_anonymous:true,app_metadata:{cms_role:"admin"}},
    null,
  ]) {
    const fixture = actionFixture(user);
    await assert.rejects(fixture.action(form));
    assert.equal(fixture.writes.length,0);
  }
});

test("saving a cover preserves zero and negative navigation order", async () => {
  const fixture = actionFixture(), form = new FormData();
  form.set("navigation_count","3");
  form.set("navigation_0_sort_order","-10");
  form.set("navigation_1_sort_order","0");
  form.set("navigation_2_sort_order","invalid");
  await assert.rejects(fixture.action(form), /REDIRECT:\/admin\/site/);
  const rows = fixture.writes.find(x=>x.table==="site_navigation_items").payload;
  assert.equal(rows[0].sort_order,-10);
  assert.equal(rows[1].sort_order,0);
  assert.equal(rows[2].sort_order,2);
});
