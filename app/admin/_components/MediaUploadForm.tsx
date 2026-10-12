"use client";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { prepareFormUploads } from "@/lib/media/upload-client";
import type { UploadScope } from "@/lib/media/direct-upload-policy";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, UploadScope>; children: ReactNode; className?: string;
  onPendingChange?: (pending: boolean) => void; resetOnSuccess?: boolean;
}
export default function MediaUploadForm({ action, fields, children, className, onPendingChange, resetOnSuccess = false }: Props) {
  const [pending, startTransition] = useTransition();
  useEffect(() => { onPendingChange?.(pending); }, [pending, onPendingChange]);
  const [error, setError] = useState<string | null>(null);
  return <form className={className} onSubmit={(event) => {
    event.preventDefault();
    if (pending) return;
    const element = event.currentTarget;
    const form = new FormData(element);
    startTransition(async () => {
      setError(null);
      try {
        await action(await prepareFormUploads(form, fields));
        if (resetOnSuccess) element.reset();
        else element.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach((input) => { input.value = ""; });
      } catch (err) {
        if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) throw err;
        setError(err instanceof Error ? err.message : "Save failed. Please try again.");
      }
    });
  }}>
    <fieldset disabled={pending} className="contents" aria-busy={pending}>{children}</fieldset>
    {pending ? <p role="status" className="text-sm text-stone-500">Uploading and saving…</p> : null}
    {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
  </form>;
}
