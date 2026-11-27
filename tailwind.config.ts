import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        background: "var(--bg-primary)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        border: "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        foreground: "var(--text-primary)",
        muted: "var(--text-secondary)",
        subtle: "var(--text-tertiary)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
          fg: "var(--accent-fg)",
        },
        "code-bg": "var(--code-bg)",
        "code-fg": "var(--code-fg)",
        "code-header": "var(--code-header-bg)",
        "code-border": "var(--code-border)",
        "inline-code-bg": "var(--inline-code-bg)",
        "inline-code-fg": "var(--inline-code-fg)",
        "terminal-bg": "var(--terminal-bg)",
        "terminal-fg": "var(--terminal-fg)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
