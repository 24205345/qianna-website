const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() &&
      process.env.TURNSTILE_SECRET_KEY?.trim()
  );
}

export function getTurnstileSiteKey(): string | null {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || null;
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Turnstile verify HTTP error:", response.status);
    return false;
  }

  const data = (await response.json()) as TurnstileVerifyResponse;
  if (!data.success) {
    console.error("Turnstile verify failed:", data["error-codes"]?.join(", "));
  }
  return data.success;
}
