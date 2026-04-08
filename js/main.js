import { renderHeader } from "./components/header.js";

renderHeader();

const page = document.body.dataset.page;

if (page === "feed") {
  import("./pages/feed.js");
}

if (page === "profile") {
  import("./pages/profile.js");
}

if (page === "post") {
  import("./pages/post.js");
}

if (page === "edit") {
  import("./pages/edit.js");
}

if (page === "create") {
  import("./pages/create.js");
}

if (page === "login") {
  import("./auth/login.js");
}

if (page === "register") {
  import("./auth/register.js");
}