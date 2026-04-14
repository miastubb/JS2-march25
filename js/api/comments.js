import { apiRequest } from "./requests.js";

export function createComment(postId, body) {
  if (!postId) throw new Error("Post ID is required");

  const trimmedBody = body?.trim();

  if (!trimmedBody) throw new Error("Comment body is required");

  return apiRequest(`/social/posts/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ body: trimmedBody }),
  });
}