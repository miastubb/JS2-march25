export const CONFIG = {
  BASE_URL: "https://v2.api.noroff.dev",
};

export const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/your-repo-name/"
  : "/";