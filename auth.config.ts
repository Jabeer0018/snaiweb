import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";

export const isGoogleConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim()
);

export const isAppleConfigured = Boolean(
  process.env.AUTH_APPLE_ID?.trim() && process.env.AUTH_APPLE_SECRET?.trim()
);

const providers: NextAuthConfig["providers"] = [];

if (isGoogleConfigured) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "select_account",
        },
      },
    })
  );
}

if (isAppleConfigured) {
  providers.push(
    Apple({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: process.env.AUTH_APPLE_SECRET!,
    })
  );
}

export function sanitizeCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return "/";
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/";
  if (trimmed.startsWith("/login") || trimmed.startsWith("/api/auth")) return "/";
  return trimmed;
}

export const authConfig: NextAuthConfig = {
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  trustHost: true,
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        // Provider-namespaced stable ID prevents automatic cross-provider account linking by email
        token.accountId = `${account.provider}:${account.providerAccountId}`;
        token.provider = account.provider;
      }
      if (profile?.name && !token.name) {
        token.name = profile.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const accountId =
          typeof token.accountId === "string"
            ? token.accountId
            : token.sub || "unknown";
        (session.user as { id?: string; provider?: string }).id = accountId;
        (session.user as { id?: string; provider?: string }).provider =
          typeof token.provider === "string" ? token.provider : "oauth";
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/") && !url.startsWith("//")) {
        return `${baseUrl}${url}`;
      }
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        // Fallback to baseUrl on malformed URL
      }
      return baseUrl;
    },
  },
};
