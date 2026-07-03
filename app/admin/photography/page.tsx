import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { deleteCollectionAction } from "./actions";
import { signOutAction } from "@/app/admin/projects/actions";

interface CollectionRow {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  status: string;
  sort_order: number;
}

export default async function AdminPhotographyPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">摄影管理</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            尚未配置 Supabase 环境变量。请先在 <code>.env.local</code> 中填入后重启。
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("photography_collections")
    .select("id, title, slug, subtitle, status, sort_order")
    .order("sort_order", { ascending: true });

  const collections = (data ?? []) as CollectionRow[];

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Admin</p>
            <h1 className="mt-2 font-serif text-3xl text-stone-900">摄影管理</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/projects" className="text-sm text-stone-500 hover:text-stone-800">
              项目管理
            </Link>
            <Link href="/admin/visual-works" className="text-sm text-stone-500 hover:text-stone-800">
              视觉作品
            </Link>
            <Link href="/admin/field-notes" className="text-sm text-stone-500 hover:text-stone-800">
              Field Notes
            </Link>
            <Link href="/admin/photography/new" className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700">
              + 新增系列
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-100">
                退出登录
              </button>
            </form>
          </div>
        </div>

        {error ? (
          <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">读取失败：{error.message}</p>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">标题</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">副标题</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">排序</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {collections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                    暂无系列。可运行 seed-photography.sql 或点击「新增系列」。
                  </td>
                </tr>
              ) : (
                collections.map((c) => (
                  <tr key={c.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 text-stone-800">{c.title}</td>
                    <td className="px-4 py-3 text-stone-500">{c.slug}</td>
                    <td className="px-4 py-3 text-stone-500">{c.subtitle}</td>
                    <td className="px-4 py-3">
                      <span className={c.status === "published" ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700" : "rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500"}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{c.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/photography/${c.id}/edit`} className="text-stone-600 hover:underline">
                          编辑
                        </Link>
                        <form action={deleteCollectionAction.bind(null, c.id)}>
                          <button type="submit" className="text-red-500 hover:underline">删除</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
