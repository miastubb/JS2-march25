import { BASE_PATH } from "../api/config.js";
import { createPost } from "../api/posts.js";
import { requireAuth } from "../auth/guard.js";

requireAuth();

const root = document.getElementById("app");

root.innerHTML = `
  <section class="create-post">
    <h1>Create Post</h1>

    <form id="create-post-form">
      <input type="text" id="title" placeholder="Title" required />
      <textarea id="body" placeholder="Write your post..." required></textarea>
      <input type="url" id="media" placeholder="Image URL (optional)" />
      <button type="submit">Publish</button>
    </form>

    <p id="message"></p>
  </section>
`;

const form = document.getElementById("create-post-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();
  const mediaUrl = document.getElementById("media").value.trim();

  const postData = {
    title,
    body,
  };

  if (mediaUrl) {
    postData.media = {
      url: mediaUrl,
      alt: title || "Post image",
    };
  }

  try {
    message.textContent = "Publishing...";

    await createPost(postData);

    message.textContent = "Post created successfully!";

    setTimeout(() => {
      window.location.href = BASE_PATH;
    }, 1000);
  } catch (error) {
    message.textContent = `Error: ${error.message}`;
  }
});