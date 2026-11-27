"use client";

import { useState } from "react";
import { Cpu, Sparkles } from "lucide-react";

const TOKEN_EXAMPLES: Record<
  string,
  {
    tokens: { text: string; id: number }[];
    predictions: { token: string; prob: number }[];
  }
> = {
  "The sun rises in the ": {
    tokens: [
      { text: "The", id: 464 },
      { text: " sun", id: 4252 },
      { text: " rises", id: 22923 },
      { text: " in", id: 287 },
      { text: " the", id: 262 },
    ],
    predictions: [
      { token: "east", prob: 0.74 },
      { token: "morning", prob: 0.14 },
      { token: "sky", prob: 0.08 },
      { token: "west", prob: 0.01 },
    ],
  },
  "The trophy didn't fit in the suitcase because it was too ": {
    tokens: [
      { text: "The", id: 464 },
      { text: " trophy", id: 16218 },
      { text: " didn't", id: 1422 },
      { text: " fit", id: 4197 },
      { text: " ...", id: 0 },
      { text: " too", id: 1165 },
    ],
    predictions: [
      { token: "big", prob: 0.68 },
      { token: "large", prob: 0.19 },
      { token: "wide", prob: 0.07 },
      { token: "small", prob: 0.03 },
    ],
  },
};

export function AiLlmVisualizer() {
  const [tab, setTab] = useState<"perceptron" | "llm">("perceptron");
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1);
  const [bias, setBias] = useState(-1.5);
  const [promptKey, setPromptKey] = useState<string>("The sun rises in the ");

  const truthTable = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ].map(([x1, x2]) => {
    const sum = w1 * x1 + w2 * x2 + bias;
    const out = sum >= 0 ? 1 : 0;
    return {
      x1,
      x2,
      sum: sum.toFixed(1),
      out,
      andTarget: x1 & x2,
      orTarget: x1 | x2,
      xorTarget: x1 ^ x2,
    };
  });

  const isAnd = truthTable.every((r) => r.out === r.andTarget);
  const isOr = truthTable.every((r) => r.out === r.orTarget);
  const llm = TOKEN_EXAMPLES[promptKey];

  return (
    <div className="space-y-6 border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Cpu className="h-4 w-4" />
            AI &amp; LLM Interactive Lab (Educational Simulation)
          </h3>
          <p className="mt-1 text-xs text-muted">
            Modules C15–C17 — Explore single-layer Perceptron limits (AND/OR vs XOR) and LLM next-token prediction.
          </p>
        </div>
        <div className="inline-flex border border-border bg-background p-0.5">
          <button
            type="button"
            onClick={() => setTab("perceptron")}
            className={`px-3 py-1 text-xs font-medium ${
              tab === "perceptron"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            Perceptron &amp; XOR
          </button>
          <button
            type="button"
            onClick={() => setTab("llm")}
            className={`px-3 py-1 text-xs font-medium ${
              tab === "llm"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            LLM Tokens &amp; Prediction
          </button>
        </div>
      </div>

      {tab === "perceptron" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="border border-border bg-background p-3 text-xs">
              <span className="flex justify-between font-mono text-foreground">
                <span>Weight w₁</span>
                <span>{w1}</span>
              </span>
              <input
                type="range"
                min={-2}
                max={2}
                step={0.5}
                value={w1}
                onChange={(e) => setW1(Number(e.target.value))}
                className="mt-2 w-full accent-foreground"
              />
            </label>
            <label className="border border-border bg-background p-3 text-xs">
              <span className="flex justify-between font-mono text-foreground">
                <span>Weight w₂</span>
                <span>{w2}</span>
              </span>
              <input
                type="range"
                min={-2}
                max={2}
                step={0.5}
                value={w2}
                onChange={(e) => setW2(Number(e.target.value))}
                className="mt-2 w-full accent-foreground"
              />
            </label>
            <label className="border border-border bg-background p-3 text-xs">
              <span className="flex justify-between font-mono text-foreground">
                <span>Bias b</span>
                <span>{bias}</span>
              </span>
              <input
                type="range"
                min={-2.5}
                max={1.5}
                step={0.5}
                value={bias}
                onChange={(e) => setBias(Number(e.target.value))}
                className="mt-2 w-full accent-foreground"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setW1(1);
                setW2(1);
                setBias(-1.5);
              }}
              className="border border-border bg-background px-2.5 py-1 font-mono hover:border-foreground"
            >
              Preset: AND Gate
            </button>
            <button
              type="button"
              onClick={() => {
                setW1(1);
                setW2(1);
                setBias(-0.5);
              }}
              className="border border-border bg-background px-2.5 py-1 font-mono hover:border-foreground"
            >
              Preset: OR Gate
            </button>
            <span className="ml-auto font-mono text-xs text-foreground">
              {isAnd
                ? "Matches AND (linearly separable)"
                : isOr
                  ? "Matches OR (linearly separable)"
                  : "No single-layer w₁, w₂, b can ever match XOR!"}
            </span>
          </div>

          <div className="overflow-x-auto border border-border bg-background">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-border bg-elevated text-subtle">
                <tr>
                  <th className="px-3 py-2">x₁</th>
                  <th className="px-3 py-2">x₂</th>
                  <th className="px-3 py-2">w₁x₁ + w₂x₂ + b</th>
                  <th className="px-3 py-2">Output</th>
                  <th className="px-3 py-2">XOR Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {truthTable.map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{r.x1}</td>
                    <td className="px-3 py-2">{r.x2}</td>
                    <td className="px-3 py-2">{r.sum}</td>
                    <td className="px-3 py-2 font-semibold text-foreground">{r.out}</td>
                    <td className="px-3 py-2 text-muted">{r.xorTarget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(TOKEN_EXAMPLES).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPromptKey(k)}
                className={`border px-3 py-1.5 text-left font-mono text-xs ${
                  promptKey === k
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted hover:text-foreground"
                }`}
              >
                &ldquo;{k.trim()} ___&rdquo;
              </button>
            ))}
          </div>

          <div className="border border-border bg-background p-4">
            <p className="font-mono text-[11px] uppercase text-subtle">
              Step 1: Tokenization -&gt; Integer Token IDs (Illustrative)
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {llm.tokens.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 border border-border bg-surface px-2.5 py-1 font-mono text-xs"
                >
                  <span className="text-foreground">{t.text}</span>
                  <span className="text-[10px] text-subtle">#{t.id}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="border border-border bg-background p-4">
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-subtle">
              <Sparkles className="h-3.5 w-3.5" />
              Step 2: Next-Token Probability Distribution (Simulated)
            </p>
            <div className="mt-3 space-y-2">
              {llm.predictions.map((p) => (
                <div key={p.token} className="flex items-center gap-3 font-mono text-xs">
                  <span className="w-20 text-foreground">{p.token}</span>
                  <div className="h-2 flex-1 bg-surface">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${Math.round(p.prob * 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-muted">
                    {Math.round(p.prob * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
