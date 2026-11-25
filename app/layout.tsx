import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { getAllModules, getSearchIndex } from "@/lib/content";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SNAI Course — Student Knowledge Hub",
    template: "%s | SNAI Course",
  },
  description:
    "Centralised university learning platform for course notes, commands, explanations, practical examples, reference materials, and revision resources. Learn. Practise. Understand.",
};

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('snai-theme');
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const modules = getAllModules();
  const searchDocuments = getSearchIndex();

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <AppShell modules={modules} searchDocuments={searchDocuments}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
