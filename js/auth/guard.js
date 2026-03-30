import { getToken } from "../storage/token";

export function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = "../account/login.html";
  }
}
