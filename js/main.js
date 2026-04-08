import { renderHeader } from "./components/header.js";

renderHeader();

const page = document.body.dataset.page;

if (page === "feed") {
  import("./pages/feed.js");
}

if (page === "post") {
  import("./pages/post.js");
}


if (page === "login") {
  import("./auth/login.js");
}

if (page === "register") {
  import("./auth/register.js");
}