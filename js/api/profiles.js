import { apiRequest } from "./requests.js";

/**
 * Fetches a user profile by username, including their followers and following lists.
 *
 * @async
 * @param {string} name - The username of the profile to retrieve.
 * @returns {Promise<object>} The user profile data including followers and following.
 */
export async function getUserProfileByName(name) {
  const response = await apiRequest(
    `/social/profiles/${encodeURIComponent(name)}?_followers=true&_following=true`
  );
  return response.data;
}

export async function followProfile(name) {
  const response = await apiRequest(
    `/social/profiles/${encodeURIComponent(name)}/follow`,
    {
      method: "PUT",
    }
  );

  return response.data;
}

export async function unfollowProfile(name) {
  const response = await apiRequest(
    `/social/profiles/${encodeURIComponent(name)}/unfollow`,
    {
      method: "PUT",
    }
  );

  return response.data;
}