// Helper function to extract and decode the title part from the URL
export const extractTitlePart = (currentPage: string) => {
  const [, raw = ""] = currentPage.split("/posts/");
  return decodeURIComponent(raw.replace(/\/$/, ""));
};

export const getSlugParts = (slug: string) => {
  const [numberPart = "", ...nameParts] = slug.split("-");
  return {
    numberPart,
    name: nameParts.join("-"),
  };
};

export const getIndex = (currentPage: string) => {
  const { numberPart } = getSlugParts(extractTitlePart(currentPage));
  return Number.parseInt(numberPart, 10);
};

export const sortPosts = (allPosts: any) => {
  return allPosts.sort((a: any, b: any) => getIndex(b.url) - getIndex(a.url));
};

export const toNumericUrl = (currentPage: string) => {
  const index = getIndex(currentPage);
  return Number.isNaN(index) ? currentPage : `/posts/${index}`;
};

export const parseTitle = (
  currentPage: string,
  legacySlug?: string,
  fallbackName = "",
  lang = "zh",
  isSidebar = false,
) => {
  const slug = legacySlug ?? extractTitlePart(currentPage);
  const { numberPart, name } = getSlugParts(slug);
  const displayName = name || fallbackName;

  if (lang === "en") {
    if (isSidebar) {
      return `${numberPart}.`;
    }
    const cleanName = displayName.replace(/-/g, " ");
    return `${numberPart}.${cleanName ? ` ${cleanName}` : ""}`;
  }

  let title = `第${numberPart}期`;
  if (displayName) {
    title += ` - ${displayName}`;
  }
  return title;
};

// ---------------------------------------------------------------------------
// 知识库版新增：标题、标签、阅读时长
// 原版把「第 N 期」写死在标题里，这里改成优先读 frontmatter.title，
// 没有 title 才退回到文件名（去掉开头的编号）。
// ---------------------------------------------------------------------------

export const postTitle = (post: any): string => {
  const fm = post?.frontmatter ?? {};
  if (fm.title) return String(fm.title);
  const slug = fm.legacySlug ?? extractTitlePart(post?.url ?? "");
  const { name } = getSlugParts(slug);
  return name ? decodeURIComponent(name) : "无标题";
};

export const postTags = (post: any): string[] => {
  const tags = post?.frontmatter?.tags;
  if (!tags) return [];
  return Array.isArray(tags) ? tags.map(String) : String(tags).split(",").map((t) => t.trim()).filter(Boolean);
};

export const postHref = (post: any): string =>
  post?.frontmatter?.numericUrl ?? toNumericUrl(post?.url ?? "");

// 标签直接进 URL 会有编码和空格问题，统一走 slug
export const tagSlug = (tag: string): string =>
  encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, "-"));

// 同一个标签固定同一个色相，卡片占位封面才不会每次刷新变色
export const tagHue = (tag: string): number => {
  let hash = 0;
  for (let i = 0; i < tag.length; i += 1) hash = (hash * 31 + tag.charCodeAt(i)) % 360;
  return hash;
};

export const readingTime = (body: string | undefined): number => {
  if (!body) return 1;
  const chinese = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (body.match(/[a-zA-Z]+/g) ?? []).length;
  // 中文按 400 字/分钟，英文按 200 词/分钟
  return Math.max(1, Math.round(chinese / 400 + words / 200));
};

export const formatDate = (date: string | Date | undefined, sep = "-"): string => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join(sep);
};

// Resize a cover image through the CDN it lives on. Cloudflare R2
// (cdn.tw93.fun) ignores Aliyun's ?x-oss-process= and would serve the
// multi-megabyte original, so it gets its own /cdn-cgi/image/ transform.
const R2_PREFIX = "https://cdn.tw93.fun/";
const OSS_HOST =
  /^https:\/\/(?:cdn\.fliggy\.com|cdn\.alipayobjects\.com|gw\.alipayobjects\.com|gw\.alicdn\.com|img\.alicdn\.com)\//;

export const resizeImage = (url: string, width: number, quality = 80) => {
  if (url.startsWith(R2_PREFIX) && !url.includes("/cdn-cgi/image/")) {
    return `${R2_PREFIX}cdn-cgi/image/width=${width},quality=${quality},format=auto,fit=scale-down/${url.slice(R2_PREFIX.length)}`;
  }
  if (OSS_HOST.test(url) && !url.includes("x-oss-process")) {
    return `${url}${url.includes("?") ? "&" : "?"}x-oss-process=image/resize,w_${width}/quality,q_${quality}/format,webp`;
  }
  return url;
};

// Card covers at quality 90: 800 stays above every desktop column (320 to 390
// CSS px) at 2x, 1200 keeps single-column phones sharp at 3x. The old 640 sat
// exactly at 2x on the four-column grid at the CDN's default quality and read
// soft. Sizes follow the feed grid in index.css.
export const cardImage = (url: string) => ({
  src: resizeImage(url, 800, 90),
  srcset: `${resizeImage(url, 800, 90)} 800w, ${resizeImage(url, 1200, 90)} 1200w`,
  sizes:
    "(min-width: 1300px) 320px, (min-width: 1000px) 364px, (min-width: 640px) 390px, min(calc(100vw - 32px), 544px)",
});
