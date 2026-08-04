"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validateGuestbookInput } from "@/lib/guestbook/validation";

export type SubmitGuestbookState =
  | { ok: true; message: string }
  | { ok: false; error: string };

function hashIpAddress(ip: string): string {
  return createHash("sha256").update(`guestbook:${ip}`).digest("hex");
}

async function getClientIp(): Promise<string | null> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }
  return headerStore.get("x-real-ip");
}

async function isRateLimited(ipHash: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("guestbook_is_rate_limited", {
    p_ip_hash: ipHash,
  });

  if (error) {
    console.error("Guestbook rate limit check failed:", error.message);
    return false;
  }

  return Boolean(data);
}

export async function submitGuestbookMessage(
  _prevState: SubmitGuestbookState | null,
  formData: FormData
): Promise<SubmitGuestbookState> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return {
      ok: true,
      message: "Thanks — your note will appear after review.",
    };
  }

  const authorName = String(formData.get("authorName") ?? "");
  const authorEmail = String(formData.get("authorEmail") ?? "");
  const message = String(formData.get("message") ?? "");
  const validation = validateGuestbookInput(authorName, authorEmail, message);
  if (!validation.ok) {
    return validation;
  }

  const ip = await getClientIp();
  const ipHash = ip ? hashIpAddress(ip) : null;
  if (ipHash && (await isRateLimited(ipHash))) {
    return {
      ok: false,
      error: "Too many messages from this network. Please try again later.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("guestbook_messages").insert({
    author_name: validation.authorName,
    author_email: validation.authorEmail,
    message: validation.message,
    status: "pending",
    ip_hash: ipHash,
  });

  if (error) {
    console.error("Guestbook insert failed:", error.message);
    return {
      ok: false,
      error: "Could not send your message. Please try again in a moment.",
    };
  }

  revalidatePath("/");
  return {
    ok: true,
    message: "Thanks — your note will appear after review.",
  };
}
