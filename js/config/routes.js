import { BASE_PATH } from "../api/config.js";

export const ROUTES = {
  home: `${BASE_PATH}`,
  login: `${BASE_PATH}pages/login.html`,
  register: `${BASE_PATH}pages/register.html`,
  post: (id) => `${BASE_PATH}pages/post.html?id=${id}`,
  edit: (id) => `${BASE_PATH}pages/edit.html?id=${id}`,
};