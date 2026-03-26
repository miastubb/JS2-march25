import { apiRequest } from './requests.js';
import { saveToken } from '../storage/token.js';
import { saveApiKey } from '../storage/apiKey.js';

export function registerUser({ name, email, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email, password) {
  const loginResponse = await apiRequest("/auth/login", {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const accessToken = loginResponse?.data?.accessToken;

  if (!accessToken) {
    throw new Error("Login succeeded but no access token received");
  }

  saveToken(accessToken);

  const apiKeyResponse = await apiRequest("/auth/create-api-key", {
    method: "POST",
    body: JSON.stringify({ name: "js2-project-key"}),
  });

   const apiKey = apiKeyResponse?.data?.key;

   if (apiKey) {
    saveApiKey(apiKey);
   }

   return loginResponse;
}
