import { BASE_PATH } from "../api/config.js";
import { createPost } from "../api/posts.js";
import { requireAuth } from "../auth/guard.js";

requireAuth();

const root = document.getElementById("app");

root.innerHTML = `
  <section class="create-post">
    <h1>Create Post</h1>

    <form id="create-post-form">
      <label for="title">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        placeholder="Title"
        required
      />

      <label for="body">Body</label>
      <textarea
        id="body"
        name="body"
        placeholder="Write your post..."
        required
      ></textarea>

      <label for="media">Image URL (optional)</label>
      <input
        type="url"
        id="media"
        name="media"
        placeholder="Image URL (optional)"
      />

      <button id="submit-create-post" type="submit">Publish</button>
    </form>

    <p id="message" aria-live="polite"></p>
  </section>
`;

const form = document.getElementById("create-post-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const mediaInput = document.getElementById("media");
const submitButton = document.getElementById("submit-create-post");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const mediaUrl = mediaInput.value.trim();

  if (!title || !body) {
    message.textContent = "Title and body are required.";
    return;
  }

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
    submitButton.disabled = true;
    submitButton.textContent = "Publishing...";
    message.textContent = "Publishing...";

    await createPost(postData);

    message.textContent = "Post created successfully!";

    setTimeout(() => {
      window.location.href = BASE_PATH;
    }, 1000);
  } catch (error) {
    message.textContent = `Error: ${error.message}`;
    submitButton.disabled = false;
    submitButton.textContent = "Publish";
  }
});