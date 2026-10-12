import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";
import { S3Client } from "@aws-sdk/client-s3";
const require = createRequire(import.meta.url), cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file,"utf8"), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code, { exports, Buffer, URL, process, console, require(name) {
    if (name.startsWith(".")) {
      const p=path.resolve(path.dirname(file),name);
      if (fs.existsSync(p+".ts")) return load(p+".ts");
    }
    return require(name);
  } }, {filename:file});
  return exports;
}
const core=load("lib/media/direct-upload-core.ts"), policy=load("lib/media/direct-upload-policy.ts");
const env={R2_ACCOUNT_ID:"a".repeat(32),R2_ACCESS_KEY_ID:"test-key",R2_SECRET_ACCESS_KEY:"test-secret",R2_BUCKET_NAME:"portfolio-media",R2_PUBLIC_BASE_URL:"https://media.example.com"};
const userId="user-1", scope="project-cover";
const ticket={version:1,stage:"complete",userId,scope,key:"uploads/project-cover/user-1/a.jpg",size:12,contentType:"image/jpeg",expiresAt:Date.now()+60_000};
test("upload receipts bind owner, scope, stage, expiry and signature",()=>{
  const token=core.signUploadTicket(ticket,env);
  assert.equal(core.verifyUploadTicket(token,userId,scope,"complete",env).key,ticket.key);
  for(const args of [[token,"other",scope,"complete"],[token,userId,"photography","complete"],[token,userId,scope,"pending"],[token+"a",userId,scope,"complete"]]) assert.throws(()=>core.verifyUploadTicket(...args,env));
  assert.throws(()=>core.verifyUploadTicket(core.signUploadTicket({...ticket,expiresAt:0},env),userId,scope,"complete",env));
  assert.throws(()=>core.verifyUploadTicket(core.signUploadTicket({...ticket,key:"legacy/a.jpg"},env),userId,scope,"complete",env));
});
test("upload policy rejects active content, inherited object keys and oversized files",()=>{
 const input={scope,fileName:"a.png",contentType:"image/png",size:100};
 for(const changed of [{contentType:"image/svg+xml"},{contentType:"text/html"},{contentType:"toString"},{contentType:"__proto__"},{size:0},{size:32*1024*1024+1},{scope:"../private"}])assert.throws(()=>policy.validateUploadInput({...input,...changed}));
 assert.equal(policy.validateUploadInput({...input,scope:"note-attachment",contentType:"application/pdf"}).extension,"pdf");
 assert.throws(()=>policy.validateUploadInput({...input,contentType:"application/pdf"}));
});
test("presigned PUT binds file size, type and create-only header",async()=>{
 const result=await core.prepareDirectUpload(userId,{scope,fileName:"a.png",contentType:"image/png",size:1024},env);
 const url=new URL(result.uploadUrl);
 assert.equal(url.searchParams.get("X-Amz-Expires"),"600");
 const signed=url.searchParams.get("X-Amz-SignedHeaders");
 for(const header of ["content-type","content-length","if-none-match"]) assert.ok(signed.split(";").includes(header),header);
 assert.equal(result.headers["If-None-Match"],"*");
 for(const header of signed.split(";")) if(!["host","content-length"].includes(header)) assert.ok(Object.keys(result.headers).some(key=>key.toLowerCase()===header),header+" must be sent by the browser");
 assert.equal(url.searchParams.get("x-amz-meta-upload-user"),null);
 assert.ok(core.verifyUploadTicket(result.ticket,userId,scope,"pending",env).key.startsWith("uploads/project-cover/user-1/"));
});
test("completion checks actual object metadata rather than trusting a submitted URL",async(context)=>{
 let current={ContentLength:ticket.size,ContentType:ticket.contentType,Metadata:{"upload-user":userId,"upload-scope":scope}};
 context.mock.method(S3Client.prototype,"send",async()=>current);
 assert.equal(await core.inspectUploadedObject(ticket,env),"https://media.example.com/"+ticket.key);
 for(const changed of [{ContentLength:99},{ContentType:"text/html"},{Metadata:{"upload-user":"other","upload-scope":scope}}]) {
 current={ContentLength:ticket.size,ContentType:ticket.contentType,Metadata:{"upload-user":userId,"upload-scope":scope},...changed};
 await assert.rejects(core.inspectUploadedObject(ticket,env),/verification failed/);
 }
});
test("completion rejects a spoofed image even if its MIME header matches",async(context)=>{
 context.mock.method(S3Client.prototype,"send",async(command)=>command.constructor.name==="HeadObjectCommand"?{ContentLength:12,ContentType:"image/jpeg",Metadata:{"upload-user":userId,"upload-scope":scope}}:{Body:{transformToByteArray:async()=>Buffer.from("not an image")}});
 const token=core.signUploadTicket({...ticket,stage:"pending"},env);
 await assert.rejects(core.completeDirectUpload(userId,token,env),/contents do not match/);
});

test("Notes attachments support empty browser MIME values without widening image scopes", () => {
  const input = { scope: "note-attachment", fileName: "unknown.data", size: 50, contentType: "application/octet-stream" };
  assert.equal(policy.getUploadContentType("image.JPG", ""), "image/jpeg");
  assert.equal(policy.getUploadContentType("report.pdf", ""), "application/pdf");
  assert.equal(policy.getUploadContentType("unknown.data", ""), "application/octet-stream");
  assert.equal(policy.getUploadContentType("fake.png", "text/html"), "text/html");
  assert.equal(policy.validateUploadInput(input).extension, "bin");
  assert.equal(policy.validateUploadInput({ ...input, contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }).extension, "docx");
  assert.throws(() => policy.validateUploadInput({ ...input, scope: "project-cover" }));
  assert.throws(() => policy.validateUploadInput({ ...input, fileName: {} }));
});

test("Photography and Drawings save receipt-only forms and still reject missing media", async () => {
  for (const [file, field, action] of [
    ["app/admin/photography/photo-actions.ts", "photo", "addPhotoAction"],
    ["app/admin/visual-works/work-actions.ts", "work", "addWorkAction"],
  ]) {
    const inserts = [];
    const client = { auth: { getUser: async () => ({ data: { user: { id: userId } } }) }, from: () => ({ insert: async payload => { inserts.push(payload); return { error: null }; } }) };
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const actions = {};
    vm.runInNewContext(code, { exports: actions, FormData, require(name) {
      if (name === "@/lib/supabase/server") return { createClient: async () => client };
      if (name === "@/lib/media/form-upload") return { getFormMediaUrl: async (_client, form, name) => form.get(name + "_upload_receipt") ? "https://media.example.com/verified.jpg" : null };
      if (name === "next/cache") return { revalidatePath() {} };
      if (name === "next/navigation") return { redirect() { throw Error("Unexpected redirect"); } };
      throw Error("Unexpected import " + name);
    } });
    const form = new FormData();
    form.set("title", "Receipt regression");
    form.set(field + "_upload_receipt", "server-verified-receipt");
    await actions[action]("fixture-parent", form);
    assert.equal(inserts.length, 1);
    assert.equal(inserts[0].url, "https://media.example.com/verified.jpg");
    form.delete(field + "_upload_receipt");
    await assert.rejects(actions[action]("fixture-parent", form), /choose an image/);
    assert.equal(inserts.length, 1);
  }
});
