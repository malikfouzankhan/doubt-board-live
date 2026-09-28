"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type PostState = { ok?: boolean; error?: string };

const MAX_LENGTH = 500;

export async function postQuestion(
  _prevState: PostState,
  formData: FormData,
): Promise<PostState> {
  const body = String(formData.get("body") ?? "").trim();

  if (!body) return { error: "Please type a question first." };
  if (body.length > MAX_LENGTH) {
    return { error: `Keep it under ${MAX_LENGTH} characters.` };
  }

  const { error } = await supabase.from("questions").insert({ body });
  if (error) {
    console.error("Failed to insert question:", error.message);
    return { error: "Could not post your question. Please try again." };
  }

  revalidatePath("/");
  return { ok: true };
}
