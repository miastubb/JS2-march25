const API_KEY_KEY = "apiKey";

export function saveApiKey(key) {
  localStorage.setItem(API_KEY_KEY, key);
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_KEY);
}

export function removeApiKey() {
  localStorage.removeItem(API_KEY_KEY);
}