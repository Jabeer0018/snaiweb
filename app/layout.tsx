import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { getAllModules, getSearchIndex } from "@/lib/content";
import { AppShell } from "@/components/AppShell";
import { auth } from "@/auth";
import type { AuthUserSummary } from "@/components/UserMenu";

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
    var theme = localStorage.getItem('snai-theme') || 'dark';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const sessionUser = session?.user as
    | { id?: string; name?: string | null; email?: string | null; image?: string | null; provider?: string }
    | undefined;

  const user: AuthUserSummary | null = sessionUser?.id
    ? {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        image: sessionUser.image,
        provider: sessionUser.provider,
      }
    : null;

  // Never serialize course modules or search indexes to unauthenticated HTML/RSC payloads
  const modules = user ? getAllModules() : [];
  const searchDocuments = user ? getSearchIndex() : [];

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
        <AppShell modules={modules} searchDocuments={searchDocuments} user={user}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
