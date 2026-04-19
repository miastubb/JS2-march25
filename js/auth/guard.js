import { BASE_PATH } from "../api/config.js";
import { getToken } from "../storage/token.js";

export function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = `${BASE_PATH}pages/login.html`;
  }
}