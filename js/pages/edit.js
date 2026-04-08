import { getPostById, updatePost } from "../api/posts.js";
import { requireAuth } from "../auth/guard.js";
import { getProfile } from "../storage/profile.js";

requireAuth();

const root = document.getElementById("app");

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}


async function renderEditPage() {
  root.innerHTML = "<p>Loading post...</p>";

  const id = getPostIdFromUrl();

  if (!id) {
    root.innerHTML = "<p>Invalid post ID.</p>";
    return;
  }

  try {
    const response = await getPostById(id);
    const post = response.data;

    if (!post) {
      root.innerHTML = "<p>Post not found.</p>";
      return;
    }

    const profile = getProfile();
    const currentUserName = profile?.name?.trim().toLowerCase();
    const ownerName = post.author?.name?.trim().toLowerCase();

    if (!currentUserName || currentUserName !== ownerName) {
      root.innerHTML = "<p>You are not allowed to edit this post.</p>";
      return;
    }

    root.innerHTML = `
      <section class="edit-post">
        <h1>Edit Post</h1>

        <form id="edit-post-form">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value="${post.title || ""}"
            required
          >

          <label for="body">Body</label>
          <textarea
            id="body"
            name="body"
            required
          >${post.body || ""}</textarea>

          <label for="media">Media URL</label>
          <input
            type="url"
            id="media"
            name="media"
            value="${post.media?.url || ""}"
          >

          <button type="submit">Update Post</button>
        </form>

        <p id="message"></p>
      </section>
    `;

    const form = document.getElementById("edit-post-form");
    const message = document.getElementById("message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.getElementById("title").value.trim();
      const body = document.getElementById("body").value.trim();
      const mediaUrl = document.getElementById("media").value.trim();

      const updatedData = {
        title,
        body,
      };

      if (mediaUrl) {
        updatedData.media = {
          url: mediaUrl,
          alt: title || "Post image",
        };
      }

      try {
        message.textContent = "Updating post...";

        await updatePost(id, updatedData);

        window.location.href = `/pages/post.html?id=${id}`;
      } catch (error) {
        message.textContent = `Error: ${error.message}`;
      }
    });
  } catch (error) {
    root.innerHTML = `<p>Error loading post: ${error.message}</p>`;
  }
}

renderEditPage();