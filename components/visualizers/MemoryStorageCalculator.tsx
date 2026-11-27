"use client";

import { useState } from "react";

export function MemoryStorageCalculator() {
  const [bits, setBits] = useState(8);
  const [kib, setKib] = useState(4);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [bpp, setBpp] = useState<3 | 4>(3);

  const safeBits = Math.max(1, Math.min(30, bits || 1));
  const valuesCount = 2 ** safeBits;
  const maxUnsigned = valuesCount - 1;
  const kibBytes = Math.max(0, kib || 0) * 1024;
  const kbBytes = Math.max(0, kib || 0) * 1000;
  const imgBytes = Math.max(0, width || 0) * Math.max(0, height || 0) * bpp;

  return (
    <div className="space-y-5 border border-border bg-surface p-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Memory, Units &amp; Image Storage Calculator
        </h3>
        <p className="text-xs text-muted">
          Calculate n-bit unsigned ranges, binary vs. decimal storage units, and
          uncompressed RGB/RGBA image sizes with formulas shown.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* n-bit range */}
        <div className="space-y-2 border border-border bg-background p-4">
          <p className="font-mono text-[11px] uppercase text-subtle">
            1. n-Bit Unsigned Range
          </p>
          <label className="flex items-center gap-2 text-xs text-muted">
            Bits (n):
            <input
              type="number"
              min={1}
              max={30}
              value={bits}
              onChange={(e) => setBits(Number(e.target.value))}
              className="w-20 border border-border bg-surface px-2 py-1 font-mono text-foreground"
            />
          </label>
          <p className="font-mono text-xs text-muted">
            2^{safeBits} ={" "}
            <strong className="text-foreground">
              {valuesCount.toLocaleString()}
            </strong>{" "}
            values
            <br />
            Range: <strong className="text-foreground">0 to {maxUnsigned.toLocaleString()}</strong>
          </p>
        </div>

        {/* KiB vs kB */}
        <div className="space-y-2 border border-border bg-background p-4">
          <p className="font-mono text-[11px] uppercase text-subtle">
            2. Binary (KiB) vs Decimal (kB)
          </p>
          <label className="flex items-center gap-2 text-xs text-muted">
            Amount:
            <input
              type="number"
              min={1}
              value={kib}
              onChange={(e) => setKib(Number(e.target.value))}
              className="w-20 border border-border bg-surface px-2 py-1 font-mono text-foreground"
            />
          </label>
          <p className="font-mono text-xs text-muted">
            {kib} KiB = {kib} × 1,024 ={" "}
            <strong className="text-foreground">
              {kibBytes.toLocaleString()} bytes
            </strong>
            <br />
            {kib} kB = {kib} × 1,000 ={" "}
            <strong className="text-foreground">
              {kbBytes.toLocaleString()} bytes
            </strong>
          </p>
        </div>

        {/* RGB / RGBA */}
        <div className="space-y-2 border border-border bg-background p-4">
          <p className="font-mono text-[11px] uppercase text-subtle">
            3. Uncompressed Image Size
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              aria-label="Image width"
              className="w-20 border border-border bg-surface px-2 py-1 font-mono text-foreground"
            />
            <span className="self-center text-subtle">×</span>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              aria-label="Image height"
              className="w-20 border border-border bg-surface px-2 py-1 font-mono text-foreground"
            />
            <select
              value={bpp}
              onChange={(e) => setBpp(Number(e.target.value) as 3 | 4)}
              aria-label="Color mode"
              className="border border-border bg-surface px-2 py-1 font-mono text-foreground"
            >
              <option value={3}>RGB (3B)</option>
              <option value={4}>RGBA (4B)</option>
            </select>
          </div>
          <p className="font-mono text-xs text-muted">
            {width} × {height} × {bpp} ={" "}
            <strong className="text-foreground">
              {imgBytes.toLocaleString()} bytes
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
