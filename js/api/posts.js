import { apiRequest } from "./requests.js";

export function getPosts({ limit = 12, sort = "created", sortOrder = "desc" } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    sort,
    sortOrder,
  });

  return apiRequest(`/social/posts?${params.toString()}`);
}

export function createPost(data) {
  return apiRequest("/social/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updatePost(id, data) {
  if (!id) throw new Error("Post ID is required");

  return apiRequest(`/social/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deletePost(id) {
  if (!id) throw new Error("Post ID is required");

  return apiRequest(`/social/posts/${id}`, {
    method: "DELETE",
  });
}