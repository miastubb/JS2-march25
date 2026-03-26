import { getToken } from "../storage/token.js";
import { getApiKey } from "../storage/apiKey.js";
import { CONFIG } from "./config.js";

export async function apiRequest(path, options = {}) {
  const url = `${CONFIG.BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  const apiKey = getApiKey();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (apiKey) {
    headers["X-Noroff-API-Key"] = apiKey;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.message || "Request failed");
  }

  return data;
}