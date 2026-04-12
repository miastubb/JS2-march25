import { BASE_PATH } from "../api/config.js";
import { getPostById, deletePost } from "../api/posts.js";
import { getProfile } from "../storage/profile.js";
import { getToken } from "../storage/token.js";
import { createButton } from "../components/button.js";

const root = document.getElementById("app");

/**
 * Reads the post ID from the current page URL query string.
 *
 * @returns {string|null} The post ID from the URL, or null if no ID is present.
 */
function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/**
 * Fetches and renders a single post based on the ID in the URL.
 * Handles guest state, invalid ID state, missing post state, owner actions, and errors.
 *
 * @async
 * @returns {Promise<void>}
 */
async function renderPost() {
  const token = getToken();

  if (!token) {
    root.innerHTML = `
      <section class="guest-state">
        <h1>Welcome</h1>
        <p>Please log in or register to view posts.</p>
        <div class="guest-state__actions">
           <a class="button" href="${BASE_PATH}pages/login.html">Login</a>
           <a class="button" href="${BASE_PATH}pages/register.html">Register</a>
        </div>
      </section>
    `;
    return;
  }

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
    const isOwner = currentUserName && ownerName && currentUserName === ownerName;

    root.innerHTML = `
      <article class="post">
        <a class="post__back" href="${BASE_PATH}index.html">← Back to feed</a>
        <h1 class="post__title">${post.title || "Untitled post"}</h1>

        ${
          post.media?.url
            ? `<img class="post__image" src="${post.media.url}" alt="${post.media.alt || post.title || "Post image"}">`
            : ""
        }

        <p class="post__author">By ${post.author?.name || "Unknown author"}</p>

        <div class="post__body">
          ${post.body || ""}
        </div>

        ${
          isOwner
            ? `<div class="post__actions">
                 <a class="post__edit" href="${BASE_PATH}pages/edit.html?id=${post.id}">Edit</a>
               </div>`
            : ""
        }
      </article>
    `;

    if (isOwner) {
      const actionsContainer = document.querySelector(".post__actions");

      const deleteButton = createButton("Delete", "post__delete");
      deleteButton.id = "delete-post-btn";

      actionsContainer.appendChild(deleteButton);

      deleteButton.addEventListener("click", async () => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
          await deletePost(post.id);
          window.location.href = BASE_PATH;
        } catch (error) {
          root.innerHTML += `<p>Unable to delete post right now. Please try again.</p>`;
          console.error("Failed to delete post:", error);
        }
      });
    }
  } catch (error) {
    console.error("Failed to load post:", error);
    root.innerHTML = "<p>Unable to load this post right now. Please try again shortly.</p>";
  }
}

renderPost();