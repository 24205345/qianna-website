import Link from "next/link";
import type { GuestbookMessage } from "@/lib/guestbook/queries";

function formatGuestbookDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface GuestbookMessageListProps {
  messages: GuestbookMessage[];
}

export default function GuestbookMessageList({
  messages,
}: GuestbookMessageListProps) {
  if (messages.length === 0) return null;

  return (
    <ul className="space-y-6">
      {messages.map((entry) => (
        <li
          key={entry.id}
          className="border-b border-stone-200/70 pb-6 last:border-0 last:pb-0"
        >
          <p className="text-xs text-stone-400">
            {entry.authorName}
            <span aria-hidden="true"> · </span>
            <time dateTime={entry.createdAt}>
              {formatGuestbookDate(entry.createdAt)}
            </time>
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            {entry.message}
          </p>
        </li>
      ))}
    </ul>
  );
}

interface GuestbookMessagesPreviewProps {
  messages: GuestbookMessage[];
  totalCount: number;
  previewLimit: number;
}

export function GuestbookMessagesPreview({
  messages,
  totalCount,
  previewLimit,
}: GuestbookMessagesPreviewProps) {
  if (messages.length === 0) return null;

  const showViewAll = totalCount > previewLimit;

  return (
    <div className="mt-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
          Recent notes
        </p>
        {showViewAll ? (
          <Link
            href="/guestbook"
            className="shrink-0 text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
          >
            View all
          </Link>
        ) : null}
      </div>
      <GuestbookMessageList messages={messages} />
    </div>
  );
}

export { formatGuestbookDate };
