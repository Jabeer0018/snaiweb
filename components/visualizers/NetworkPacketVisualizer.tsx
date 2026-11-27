"use client";

import { useState } from "react";
import { ArrowRight, Globe, Network, Server } from "lucide-react";

const SAMPLE_URLS = [
  {
    url: "https://github.com/areen2026/github-lab-A1",
    protocol: "https",
    domain: "github.com",
    ip: "20.207.73.82",
    path: "/areen2026/github-lab-A1",
  },
  {
    url: "https://www.amazon.in/dp/B09G9BL5CP",
    protocol: "https",
    domain: "www.amazon.in",
    ip: "108.156.22.41",
    path: "/dp/B09G9BL5CP",
  },
];

export function NetworkPacketVisualizer() {
  const [devices, setDevices] = useState(10);
  const [urlIdx, setUrlIdx] = useState(0);
  const [step, setStep] = useState<number>(0);

  const meshCables = (devices * (devices - 1)) / 2;
  const current = SAMPLE_URLS[urlIdx];
  const steps = [
    {
      label: "1. URL Parsed",
      detail: `Browser splits ${current.url} into Protocol (${current.protocol}), Domain (${current.domain}), and Path (${current.path}).`,
    },
    {
      label: "2. DNS Lookup",
      detail: `DNS translates human-readable domain "${current.domain}" into IPv4 address ${current.ip}.`,
    },
    {
      label: "3. Router Hop & Packets",
      detail: `Request breaks into numbered packets routed across Wi-Fi/Fiber toward destination IP ${current.ip}.`,
    },
    {
      label: "4. Server Response",
      detail: `Server at ${current.ip} returns HTML/CSS/JS or Git objects back to your client IP.`,
    },
  ];

  return (
    <div className="space-y-6 border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Network className="h-4 w-4" />
            Network, URL Anatomy &amp; Mesh Topology Lab
          </h3>
          <p className="mt-1 text-xs text-muted">
            Module C11 — Compare direct mesh cabling vs. switch/router scaling and trace DNS + packet delivery.
          </p>
        </div>
      </div>

      {/* Mesh Scaling Calculator */}
      <div className="space-y-3 border border-border bg-background p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="mesh-devices" className="text-xs font-medium text-foreground">
            Connected Devices (<span className="font-mono">{devices}</span>)
          </label>
          <input
            id="mesh-devices"
            type="range"
            min={2}
            max={50}
            value={devices}
            onChange={(e) => setDevices(Number(e.target.value))}
            className="w-48 accent-foreground"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-border bg-surface p-3">
            <p className="font-mono text-[11px] uppercase text-subtle">
              Direct Mesh: n(n − 1) / 2
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-foreground">
              {meshCables.toLocaleString()} cables
            </p>
          </div>
          <div className="border border-border bg-surface p-3">
            <p className="font-mono text-[11px] uppercase text-subtle">
              Switch / Router Star Topology
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-foreground">
              {devices} cables
            </p>
          </div>
        </div>
      </div>

      {/* URL & Packet Step-by-Step */}
      <div className="space-y-4 border border-border bg-background p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase text-subtle">
            URL &amp; Packet Tracer
          </span>
          <div className="flex gap-2">
            {SAMPLE_URLS.map((u, idx) => (
              <button
                key={u.domain}
                type="button"
                onClick={() => {
                  setUrlIdx(idx);
                  setStep(0);
                }}
                className={`border px-2.5 py-1 font-mono text-xs ${
                  urlIdx === idx
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted hover:text-foreground"
                }`}
              >
                {u.domain}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 font-mono text-xs">
          <div className="border border-border bg-surface p-2.5">
            <span className="block text-[10px] uppercase text-subtle">Protocol</span>
            <span className="text-foreground">{current.protocol}://</span>
          </div>
          <div className="border border-border bg-surface p-2.5">
            <span className="block text-[10px] uppercase text-subtle">Domain</span>
            <span className="text-foreground">{current.domain}</span>
          </div>
          <div className="border border-border bg-surface p-2.5">
            <span className="block text-[10px] uppercase text-subtle">Path</span>
            <span className="truncate block text-foreground">{current.path}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setStep(idx)}
              className={`border px-3 py-1.5 font-mono text-xs ${
                step === idx
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-start gap-3 border border-border bg-surface p-3.5 text-xs leading-relaxed text-foreground">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-subtle" />
          <Server className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
          <span>{steps[step].detail}</span>
        </div>
      </div>
    </div>
  );
}
