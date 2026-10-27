// Markdown twin of the About page, built from the same prose source the HTML
// page renders, so the two can never drift.
import aboutZh from "./data/about.zh.md?raw";
import { SITE } from "./config";

export const renderAboutMarkdown = (_lang: "zh" | "en" = "zh") => {
  const prose = aboutZh.trim();

  return [`# 关于${SITE.title}`, "", `- HTML: ${SITE.homePage}/about`, "", "---", "", prose, ""].join("\n");
};
