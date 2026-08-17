"use client";

import { useActionState, useCallback, useState } from "react";
import type { GuestbookMessage } from "@/lib/guestbook/queries";
import {
  submitGuestbookMessage,
  type SubmitGuestbookState,
} from "@/app/guestbook/actions";
import GuestbookTurnstile from "./GuestbookTurnstile";
import { GuestbookMessagesPreview } from "./GuestbookMessageList";

const INITIAL_STATE: SubmitGuestbookState | null = null;
const PREVIEW_LIMIT = 3;

interface GuestbookSectionProps {
  previewMessages: GuestbookMessage[];
  totalApprovedCount: number;
  turnstileSiteKey?: string | null;
}

export default function GuestbookSection({
  previewMessages,
  totalApprovedCount,
  turnstileSiteKey = null,
}: GuestbookSectionProps) {
  const turnstileEnabled = Boolean(turnstileSiteKey);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);

  const submitWithTurnstileReset = useCallback(
    async (
      prevState: SubmitGuestbookState | null,
      formData: FormData
    ): Promise<SubmitGuestbookState> => {
      const result = await submitGuestbookMessage(prevState, formData);
      if (result.ok) {
        setTurnstileToken("");
        setTurnstileKey((key) => key + 1);
      }
      return result;
    },
    []
  );

  const [state, formAction, isPending] = useActionState(
    submitWithTurnstileReset,
    INITIAL_STATE
  );

  const handleTokenChange = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const submitDisabled =
    isPending || (turnstileEnabled && turnstileToken.length === 0);

  return (
    <div className="mt-10 border-t border-stone-200/70 pt-10">
      <h3 className="font-serif text-xl text-stone-900 md:text-2xl">
        Say hello
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
        Leave a short note — friendly messages only. New notes are reviewed
        before they appear here.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="guestbook-website">Website</label>
          <input
            id="guestbook-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {turnstileEnabled ? (
          <>
            <input type="hidden" name="turnstileToken" value={turnstileToken} />
            <GuestbookTurnstile
              key={turnstileKey}
              siteKey={turnstileSiteKey!}
              onTokenChange={handleTokenChange}
            />
          </>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="guestbook-author-name"
              className="block min-h-5 text-xs tracking-[0.18em] text-stone-500 uppercase"
            >
              Name
            </label>
            <input
              id="guestbook-author-name"
              name="authorName"
              type="text"
              maxLength={40}
              required
              disabled={isPending}
              className="mt-2 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none transition-colors focus:border-stone-400 disabled:opacity-60"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="guestbook-author-email"
              className="block min-h-5 text-xs tracking-[0.18em] text-stone-500 uppercase"
            >
              Email <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="guestbook-author-email"
              name="authorEmail"
              type="email"
              maxLength={120}
              disabled={isPending}
              className="mt-2 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none transition-colors focus:border-stone-400 disabled:opacity-60"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="guestbook-message"
            className="block text-xs tracking-[0.18em] text-stone-500 uppercase"
          >
            Message
          </label>
          <textarea
            id="guestbook-message"
            name="message"
            rows={4}
            maxLength={500}
            required
            disabled={isPending}
            className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm leading-6 text-stone-800 outline-none transition-colors focus:border-stone-400 disabled:opacity-60"
            placeholder="Say something kind, thoughtful, or curious."
          />
        </div>

        <div className="space-y-3">
          {state?.ok === false ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : null}
          {state?.ok === true ? (
            <p className="text-sm text-stone-600">{state.message}</p>
          ) : null}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitDisabled}
              className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Send note"}
            </button>
          </div>
        </div>
      </form>

      <GuestbookMessagesPreview
        messages={previewMessages}
        totalCount={totalApprovedCount}
        previewLimit={PREVIEW_LIMIT}
      />
    </div>
  );
}
