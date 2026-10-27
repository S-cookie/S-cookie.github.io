import type { APIRoute } from "astro";
import {
  getIssue,
  getIssueBody,
  getIssues,
  renderIssueMarkdown,
  textResponse,
} from "@/agents";

export const getStaticPaths = () =>
  getIssues("zh").map((issue) => ({ params: { id: String(issue.num) } }));

export const GET: APIRoute = async ({ params }) => {
  const num = Number.parseInt(params.id ?? "", 10);
  const issue = getIssue("zh", num);
  const body = await getIssueBody("zh", num);
  if (!issue || body === null) {
    return new Response("Not Found", { status: 404 });
  }
  return textResponse(renderIssueMarkdown(issue, body));
};
