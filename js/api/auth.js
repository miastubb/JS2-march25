import { apiRequest } from './request';
import { saveToken } from '../storage/token';
import { saveApiKey } from '../storage/apiKey';

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
   if (!apiKey) {
    saveApiKey(apiKey);
   }

   return loginResponse;
  const apiKeyData = await createApiKey();
  return data;
}
