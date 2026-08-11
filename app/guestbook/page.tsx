import GuestbookMessageList from "@/app/_components/guestbook/GuestbookMessageList";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";
import {
  getApprovedGuestbookMessageCount,
  getApprovedGuestbookMessages,
} from "@/lib/guestbook/queries";

export default async function GuestbookPage() {
  const [messages, totalCount] = await Promise.all([
    getApprovedGuestbookMessages(),
    getApprovedGuestbookMessageCount(),
  ]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <PageViewTracker contentType="page" contentSlug="guestbook" />
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
          About Me
        </p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
          Say hello
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-stone-500">
          Notes from visitors — approved messages only.
        </p>

        <div className="mt-14">
          {messages.length === 0 ? (
            <p className="text-sm text-stone-400">No messages yet.</p>
          ) : (
            <>
              <p className="mb-8 text-sm text-stone-500">
                {totalCount} {totalCount === 1 ? "message" : "messages"}
              </p>
              <GuestbookMessageList messages={messages} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
