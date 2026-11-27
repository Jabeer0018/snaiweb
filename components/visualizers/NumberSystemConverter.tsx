"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type BaseType = 10 | 2 | 8 | 16;

export function NumberSystemConverter() {
  const [base, setBase] = useState<BaseType>(10);
  const [raw, setRaw] = useState("25");

  const clean = raw.trim();
  let decimalValue: number | null = null;
  let errorMsg = "";

  if (clean === "") {
    errorMsg = "Enter a non-negative integer to convert.";
  } else {
    const validators: Record<BaseType, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/,
    };
    if (!validators[base].test(clean)) {
      errorMsg = `Invalid character for Base-${base}.`;
    } else {
      const parsed = parseInt(clean, base);
      if (!Number.isSafeInteger(parsed) || parsed > 1_000_000) {
        errorMsg = "Enter a value <= 1,000,000 in decimal.";
      } else {
        decimalValue = parsed;
      }
    }
  }

  // Step-by-step division by 2 for decimal -> binary
  const divisionSteps: { n: number; q: number; r: number }[] = [];
  if (decimalValue !== null) {
    if (decimalValue === 0) {
      divisionSteps.push({ n: 0, q: 0, r: 0 });
    } else {
      let curr = decimalValue;
      while (curr > 0) {
        divisionSteps.push({ n: curr, q: Math.floor(curr / 2), r: curr % 2 });
        curr = Math.floor(curr / 2);
      }
    }
  }

  // Place-value expansion for binary -> decimal
  const binStr = decimalValue !== null ? decimalValue.toString(2) : "";
  const placeTerms = binStr
    .split("")
    .map((bit, idx) => {
      const power = binStr.length - 1 - idx;
      return { bit, power, val: Number(bit) * 2 ** power };
    });

  return (
    <div className="space-y-5 border border-border bg-surface p-5">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Binary &amp; Number System Converter
        </h3>
        <p className="text-xs text-muted">
          Enter a value in any base to inspect conversions and step-by-step
          division / positional expansion.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="inline-flex border border-border bg-background p-0.5">
          {([10, 2, 8, 16] as BaseType[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBase(b)}
              className={cn(
                "px-3 py-1.5 font-mono text-xs transition-colors",
                base === b
                  ? "bg-accent font-medium text-accent-fg"
                  : "text-muted hover:text-foreground"
              )}
            >
              Base-{b}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Enter value..."
          aria-label="Number value to convert"
          className="flex-1 min-w-[160px] border border-border-strong bg-background px-3 py-1.5 font-mono text-sm text-foreground focus:border-foreground focus:outline-none"
        />
      </div>

      {errorMsg ? (
        <p className="border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-500">
          {errorMsg}
        </p>
      ) : (
        decimalValue !== null && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Decimal (Base-10)", val: decimalValue.toString(10) },
                { label: "Binary (Base-2)", val: decimalValue.toString(2) },
                { label: "Octal (Base-8)", val: decimalValue.toString(8) },
                {
                  label: "Hex (Base-16)",
                  val: decimalValue.toString(16).toUpperCase(),
                },
              ].map((out) => (
                <div
                  key={out.label}
                  className="border border-border bg-background p-3"
                >
                  <p className="text-[11px] text-subtle">{out.label}</p>
                  <p className="mt-1 break-all font-mono text-base font-semibold text-foreground">
                    {out.val}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-border bg-background p-3.5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                  Decimal → Binary (Read Bottom to Top)
                </p>
                <div className="mt-2 space-y-1 font-mono text-xs text-muted">
                  {divisionSteps.map((s, i) => (
                    <div key={i}>
                      {s.n} / 2 = {s.q} &nbsp; r{" "}
                      <strong className="text-foreground">{s.r}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-border bg-background p-3.5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                  Positional Expansion (Base-2 → Base-10)
                </p>
                <p className="mt-2 break-words font-mono text-xs leading-relaxed text-muted">
                  {placeTerms
                    .map((t) => `(${t.bit}×2^${t.power})`)
                    .join(" + ")}{" "}
                  ={" "}
                  <strong className="text-foreground">{decimalValue}</strong>
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
