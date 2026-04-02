import { getToken } from "../storage/token.js";

export function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = "../account/login.html";
  }
}
