"use client";

import { useActionState } from "react";
import { postQuestion, type PostState } from "./actions";

export function QuestionForm() {
  const [state, action, pending] = useActionState<PostState, FormData>(
    postQuestion,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="body" className="sr-only">
        Your question
      </label>
      <textarea
        id="body"
        name="body"
        required
        maxLength={500}
        rows={4}
        placeholder="What's confusing you? Ask anything..."
        className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <div className="flex items-center justify-between gap-3">
        <p
          aria-live="polite"
          className={`text-sm ${state.error ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
        >
          {state.error ?? (state.ok ? "Posted anonymously ✓" : "")}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "Posting..." : "Post question"}
        </button>
      </div>
    </form>
  );
}
