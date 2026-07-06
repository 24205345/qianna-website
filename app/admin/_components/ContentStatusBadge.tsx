import { getStatusLabel, isPublishedStatus } from "@/lib/admin/content-status";

export default function ContentStatusBadge({ status }: { status: string }) {
  const published = isPublishedStatus(status);

  return (
    <span
      className={
        published
          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
          : "rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500"
      }
      title={published ? "Shown on the public site" : "Hidden from the public site"}
    >
      {getStatusLabel(status)}
    </span>
  );
}
