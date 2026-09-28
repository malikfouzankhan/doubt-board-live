import { supabase } from "@/lib/supabase";
import { QuestionForm } from "./question-form";

export const dynamic = "force-dynamic";

type Question = { id: number; body: string; created_at: string };

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return relative.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return relative.format(-hours, "hour");
  return relative.format(-Math.round(hours / 24), "day");
}

export default async function Home() {
  const { data, error } = await supabase
    .from("questions")
    .select("id, body, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const questions: Question[] = data ?? [];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Doubt Board</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ask anything. Your question is posted anonymously.
        </p>
      </header>

      <QuestionForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">
          Questions {questions.length > 0 && `(${questions.length})`}
        </h2>
        {error ? (
          <p className="text-red-600 dark:text-red-400">
            Could not load questions. Refresh to try again.
          </p>
        ) : questions.length === 0 ? (
          <p className="text-zinc-500">No questions yet. Be the first!</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {questions.map((q) => (
              <li
                key={q.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="whitespace-pre-wrap break-words">{q.body}</p>
                <time
                  dateTime={q.created_at}
                  className="mt-2 block text-xs text-zinc-500"
                >
                  {timeAgo(q.created_at)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
