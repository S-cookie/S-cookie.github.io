import { textResponse } from "@/agents";
import { buildPostsLlmsTxt } from "@/agentGuide";

export const GET = () =>
  textResponse(buildPostsLlmsTxt(), "text/plain; charset=utf-8");
