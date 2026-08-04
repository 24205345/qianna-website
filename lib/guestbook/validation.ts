const PROFANITY_PATTERNS = [
  /\bf+u+c+k+/i,
  /\bs+h+i+t+/i,
  /\bb+i+t+c+h+/i,
  /\ba+s+s+h+o+l+e+/i,
  /\bd+i+c+k+/i,
  /\bp+o+r+n+/i,
  /\bn+a+z+i+/i,
  /\bkill\s+yourself\b/i,
  /\bkys\b/i,
  /操你|傻逼|妈的|去死|滚蛋|草泥马|贱人|王八蛋/,
];

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s]+/i;
const EMAIL_IN_MESSAGE_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const OPTIONAL_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REPEAT_CHAR_PATTERN = /(.)\1{7,}/;

export type GuestbookValidationResult =
  | { ok: true; authorName: string; authorEmail: string | null; message: string }
  | { ok: false; error: string };

export function validateGuestbookInput(
  authorName: string,
  authorEmail: string,
  message: string
): GuestbookValidationResult {
  const trimmedName = authorName.trim();
  const trimmedEmail = authorEmail.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || trimmedName.length > 40) {
    return {
      ok: false,
      error: "Please enter a name (1–40 characters).",
    };
  }

  if (trimmedEmail) {
    if (trimmedEmail.length > 120 || !OPTIONAL_EMAIL_PATTERN.test(trimmedEmail)) {
      return {
        ok: false,
        error: "Please enter a valid email address, or leave it blank.",
      };
    }
  }

  if (!trimmedMessage || trimmedMessage.length > 500) {
    return {
      ok: false,
      error: "Please enter a message (1–500 characters).",
    };
  }

  if (
    URL_PATTERN.test(trimmedMessage) ||
    EMAIL_IN_MESSAGE_PATTERN.test(trimmedMessage)
  ) {
    return {
      ok: false,
      error: "Links and email addresses are not allowed in guestbook messages.",
    };
  }

  if (REPEAT_CHAR_PATTERN.test(trimmedMessage)) {
    return {
      ok: false,
      error: "Your message looks like spam. Please revise and try again.",
    };
  }

  const combined = `${trimmedName} ${trimmedMessage}`;
  if (PROFANITY_PATTERNS.some((pattern) => pattern.test(combined))) {
    return {
      ok: false,
      error: "Your message contains language that cannot be published.",
    };
  }

  return {
    ok: true,
    authorName: trimmedName,
    authorEmail: trimmedEmail || null,
    message: trimmedMessage,
  };
}
