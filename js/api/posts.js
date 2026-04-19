import { apiRequest } from "./requests.js";

/**
 * Fetches posts for the main feed with sorting and related author/count/reaction data.
 *
 * @param {object} [options={}] - Query options for the request.
 * @param {number} [options.limit=12] - Maximum number of posts to fetch.
 * @param {string} [options.sort="created"] - Field to sort by.
 * @param {string} [options.sortOrder="desc"] - Sort direction.
 * @returns {Promise<object>} API response containing post data.
 */
export function getPosts({ limit = 12, sort = "created", sortOrder = "desc" } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    sort,
    sortOrder,
    _author: "true",
    _count: "true",
    _reactions: "true",
  });

  return apiRequest(`/social/posts?${params.toString()}`);
}

/**
 * Fetches posts that belong to a specific user profile.
 *
 * @param {string} name - Profile name to fetch posts for.
 * @param {object} [options={}] - Query options for the request.
 * @param {number} [options.limit=20] - Maximum number of posts to fetch.
 * @param {string} [options.sort="created"] - Field to sort by.
 * @param {string} [options.sortOrder="desc"] - Sort direction.
 * @returns {Promise<object>} API response containing the profile's posts.
 */
export function getPostsByProfile(
  name,
  { limit = 20, sort = "created", sortOrder = "desc" } = {}
) {
  if (!name) throw new Error("Profile name is required");

  const params = new URLSearchParams({
    limit: String(limit),
    sort,
    sortOrder,
    _author: "true",
    _count: "true",
    _reactions: "true",
  });

  return apiRequest(
    `/social/profiles/${encodeURIComponent(name)}/posts?${params.toString()}`
  );
}

/**
 * Fetches a single post by ID, including author, comments, and reactions.
 *
 * @param {string} id - The ID of the post to fetch.
 * @returns {Promise<object>} API response containing the post data.
 */
export function getPostById(id) {
  if (!id) throw new Error("Post ID is required");

  return apiRequest(`/social/posts/${id}?_author=true&_comments=true&_reactions=true`);
}

/**
 * Creates a new post.
 *
 * @param {object} data - The post payload to send to the API.
 * @returns {Promise<object>} API response for the created post.
 */
export function createPost(data) {
  return apiRequest("/social/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing post by ID.
 *
 * @param {string} id - The ID of the post to update.
 * @param {object} data - The updated post payload.
 * @returns {Promise<object>} API response for the updated post.
 */
export function updatePost(id, data) {
  if (!id) throw new Error("Post ID is required");

  return apiRequest(`/social/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a post by ID.
 *
 * @param {string} id - The ID of the post to delete.
 * @returns {Promise<object>} API response for the delete request.
 */
export function deletePost(id) {
  if (!id) throw new Error("Post ID is required");

  return apiRequest(`/social/posts/${id}`, {
    method: "DELETE",
  });
}