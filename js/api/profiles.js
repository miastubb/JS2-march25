import { apiRequest } from "./requests";

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