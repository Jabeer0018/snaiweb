import { codeToHtml } from "shiki";

export async function highlightCode(
  code: string,
  lang: string = "bash"
): Promise<string> {
  try {
    return await codeToHtml(code.trimEnd(), {
      lang: lang || "text",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });
  } catch {
    // Fallback to plain text if language is unknown
    return await codeToHtml(code.trimEnd(), {
      lang: "text",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });
  }
}
