"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircleQuestion, ShieldCheck, ThumbsUp } from "lucide-react";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/states";
import { relativeTime } from "@/lib/utils";
import type { ProductQuestion } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { askQuestion as askQuestionRequest } from "@/services/api/product.service";
import { errorMessage } from "@/services/api/client";

export function QASection({ questions, productId }: { questions: ProductQuestion[]; productId: string }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [search, setSearch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [localQuestions, setLocalQuestions] = useState(questions);

  const filtered = localQuestions.filter((q) => q.question.toLowerCase().includes(search.toLowerCase()));

  async function askQuestion() {
    if (!isAuthenticated) {
      toast.error("Please sign in to ask a question.");
      return;
    }
    if (newQuestion.trim().length < 5) {
      toast.error("Please enter a more detailed question.");
      return;
    }
    try {
      const created = await askQuestionRequest(productId, newQuestion.trim());
      setLocalQuestions([created, ...localQuestions]);
      setNewQuestion("");
      toast.success("Your question has been submitted.");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="h-10 flex-1 rounded-full border border-border px-4 text-sm outline-none focus:border-brand"
        />
      </div>
      <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-border p-4 sm:flex-row">
        <input
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this product..."
          className="h-10 flex-1 rounded-full border border-border px-4 text-sm outline-none focus:border-brand"
        />
        <Button onClick={askQuestion}>Ask</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={MessageCircleQuestion} title="No questions yet" description="Ask the first question about this product." />
      ) : (
        <div className="flex flex-col gap-5">
          {filtered.map((q) => (
            <div key={q.id} className="border-b border-border pb-5 last:border-0">
              <p className="text-sm font-semibold">Q: {q.question}</p>
              <p className="mt-1 text-xs text-muted">Asked by {q.askedBy} · {relativeTime(q.askedAt)}</p>
              {q.answers.map((a) => (
                <div key={a.id} className="mt-2 flex gap-2 rounded-xl bg-surface p-3">
                  <div className="flex-1">
                    <p className="text-sm">{a.body}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                      {a.isStore && <ShieldCheck size={12} className="text-success" />}
                      {a.answeredBy} · {relativeTime(a.answeredAt)}
                    </p>
                  </div>
                  <button className="flex h-fit items-center gap-1 text-xs text-muted hover:text-brand">
                    <ThumbsUp size={12} /> {a.helpfulCount}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
