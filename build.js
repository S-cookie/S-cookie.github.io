import { promises as fs } from "fs";
import { readIssueArchive } from "./scripts/weekly-content.js";

async function localDate(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return new Date(stat.mtime).toISOString().split("T")[0];
  } catch {
    return null;
  }
}

async function main() {
  const archive = await readIssueArchive("./src/pages/posts", "Chinese posts", 2);
  const posts = archive.map(({ post }) => post);
  let recentContent = "";
  let indexContent = "# 文章索引\n\n> 由 `node build.js` 自动生成，请勿手改。\n\n";

  for (let i = 0; i < archive.length; i++) {
    const { filename: name, post } = archive[i];
    const { num, title: shortTitle, url } = post;
    const title = `第 ${num} 期 - ${shortTitle}`;
    const fullPath = `./src/pages/posts/${name}`;
    indexContent += `* [${title}](${url})\n`;

    if (i < 5) {
      const modified = await localDate(fullPath);
      recentContent += `* [${title}](${url})${modified ? ` - ${modified}` : ""}\n`;
    }
  }

  await Promise.all([
    fs.writeFile("POSTS.md", indexContent),
    fs.writeFile("RECENT.md", recentContent),
    fs.writeFile("public/posts.json", JSON.stringify(posts, null, 2)),
  ]);

  console.log(`build.js: ${posts.length} posts synced`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
