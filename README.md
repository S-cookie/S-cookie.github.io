# 知新

> 温故而知新。记录行业观察、产品方法与技术笔记的长期知识库。

基于 [tw93/Weekly](https://github.com/tw93/Weekly) 的视觉与结构改造：Astro 5 + Tailwind，纯静态输出，可部署在 GitHub Pages。

## 怎么加一篇新笔记

不需要写代码，只有三件事：

1. 在 `src/pages/posts/` 下新建一个 Markdown 文件，文件名必须是 `期号-标题.md`，期号两位数字、递增、不重复，例如 `09-储能项目的三个坑.md`。
2. 文件开头写这几行（`---` 之间的部分叫 front matter）：

```md
---
title: 储能项目的三个坑
date: 2026-11-02
tags: [储能, 项目管理]
description: 一句话摘要，会显示在列表卡片和搜索结果里。
---

正文从这里开始，正常写 Markdown。
```

3. 保存，提交，推送到 GitHub，站点会自动重建发布。

期号决定排序和链接（`/posts/9`），不必和日期严格对应，但**不能跳号、不能重号**。

## 怎么改已有笔记

直接改 `src/pages/posts/` 里对应的 `.md` 文件，正文随便改。改标题记得同步改 `title` 字段——URL 只用期号，所以改文件名不影响线上链接。

也可以在 GitHub 网页上打开那个文件，点铅笔图标直接编辑，commit 后同样会自动发布。

## 常用改动位置

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题、简介、关键词、作者 | `src/config.ts` 的 `SITE` |
| 评论区 | `src/config.ts` 的 `GISCUS_CONFIG`（填 GitHub Discussions 配置，留空不显示） |
| 关于页 | `src/pages/about.astro`、`src/data/about.zh.md` |
| 配色、字体、卡片样式 | `src/styles/`、`src/components/Card.astro` |
| 品牌图标 | 跑 `python scripts/make-brand-assets.py` 重新生成 |

## 本地预览

```bash
npm install      # 第一次
npm run dev      # 开发模式，改文件自动刷新，http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果
```

## 部署到 GitHub Pages

前提：仓库名必须是 `<你的用户名>.github.io`（例如 `zhangsan.github.io`），这样站点在根路径，不用改任何链接。

### 最省事：双击 `deploy.bat`

双击后它会：

1. 打开 GitHub 新建仓库页面，仓库名填 `<你的用户名>.github.io`，选 Public，**不要**勾选 README / .gitignore / license
2. 回到黑窗口输入你的 GitHub 用户名，回车
3. 自动推送，弹出浏览器让你登录 GitHub（密码由 Windows 凭据管理器保存，脚本不接触密码）
4. 推送完成后自动打开 Actions 页面

等 Actions 里 `Deploy to GitHub Pages` 变成绿色，访问 `https://<你的用户名>.github.io`。Pages 会在首次构建时自动开启，不用手动去 Settings 点。

### 手动方式

```bash
git remote add origin https://github.com/<你的用户名>/<你的用户名>.github.io.git
git push -u origin main
```

然后到仓库 `Settings → Pages` 把 `Source` 选成 **GitHub Actions**。

之后每次 push 到 `main` 都会自动重建发布，通常 1-2 分钟。

想用自己的域名：在 `Settings → Pages → Custom domain` 填域名，再把 `.github/workflows/deploy.yml` 里的 `SITE_URL` 改成那个域名。

## 目录说明

```
src/pages/posts/     文章（只改内容就动这里）
src/components/      页面组件
src/config.ts        站点配置
public/              静态资源、图标、robots.txt
scripts/             构建辅助脚本
```

## 致谢

版式、组件结构与内容管线来自 [tw93](https://github.com/tw93) 的开源项目 [Weekly](https://github.com/tw93/Weekly)，作者明确欢迎 fork 自用。原项目未附开源许可证，如需商用或再分发请先联系原作者。
