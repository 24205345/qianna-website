"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function revalidateGuestbookPaths() {
  revalidatePath("/");
  revalidatePath("/admin/guestbook");
}

export async function approveGuestbookMessageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await requireUser();
  const { error } = await supabase
    .from("guestbook_messages")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to approve message: ${error.message}`);
  }

  revalidateGuestbookPaths();
}

export async function rejectGuestbookMessageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await requireUser();
  const { error } = await supabase
    .from("guestbook_messages")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to reject message: ${error.message}`);
  }

  revalidateGuestbookPaths();
}

export async function deleteGuestbookMessageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await requireUser();
  const { error } = await supabase
    .from("guestbook_messages")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete message: ${error.message}`);
  }

  revalidateGuestbookPaths();
}
