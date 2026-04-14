import { CONFIG } from "./config.js";
import { getToken } from "../storage/token.js";
import { getApiKey } from "../storage/apiKey.js";

export async function reactToPost(postId, symbol) {
  if (!postId) throw new Error("Post ID is required");
  if (!symbol) throw new Error("Reaction symbol is required");

  const token = getToken();
  const apiKey = getApiKey();

  if (!token) throw new Error("Missing auth token");
  if (!apiKey) throw new Error("Missing API key");

  const response = await fetch(`${CONFIG.BASE_URL}/social/posts/${postId}/react/${symbol}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.message || "Failed to update reaction");
  }

  return data;
}