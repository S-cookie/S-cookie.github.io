export const SITE = {
  title: "知新",
  author: "S-cookie",
  description: "温故而知新。记录行业观察、产品方法与技术笔记的长期知识库。",
  keywords: "知识库,笔记,行业观察,产品,电网,售前",
  icon: "/icon.svg",
  siteImage: "/og.png",
  siteImageEn: "/og.png",
  // 部署后的正式域名（RSS / sitemap / OG 都会引用）
  // CI 里会被环境变量 SITE_URL 覆盖，本地不改也能跑
  homePage:
    (typeof process !== "undefined" && process.env?.SITE_URL) ||
    "https://your-domain.com",
  blogPage: "/archive",
  twitterId: "",
  githubId: "",
  repo: "your-name/knowledge-base",
};

// 评论系统：把自己的 Giscus 配置填进来即可开启，留空则不渲染评论区
export const GISCUS_CONFIG = {
  repo: "",
  repoId: "",
  category: "General",
  categoryId: "",
  mapping: "title",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "https://gw.alipayobjects.com/os/k/kr/comment.css",
  lang: "zh-CN",
};
