import { BASE_PATH } from "../api/config.js";
import { getPostById, deletePost } from "../api/posts.js";
import { getProfile } from "../storage/profile.js";
import { getToken } from "../storage/token.js";
import { createButton } from "../components/button.js";
import { renderComments } from "../components/comments.js";
import { createComment } from "../api/comments.js";
import { reactToPost } from "../api/reactions.js";

const root = document.getElementById("app");
const REACTIONS = ["👍", "❤️", "😂", "🔥"];

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
 * Attaches submit handling for the comment form on the single post page.
 *
 * @param {string|number} postId - The ID of the current post.
 * @returns {void}
 */
function attachCommentForm(postId) {
  const form = root.querySelector("#comment-form");
  const textarea = root.querySelector("#comment-body");
  const message = root.querySelector("#comment-message");

  if (!form || !textarea || !message) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const body = textarea.value.trim();

    if (!body) {
      message.textContent = "Comment cannot be empty.";
      return;
    }

    message.textContent = "Posting comment...";

    try {
      await createComment(postId, body);
      textarea.value = "";
      message.textContent = "Comment posted.";
      await renderPost();
    } catch (error) {
      console.error("Failed to create comment:", error);
      message.textContent = "Unable to post comment right now. Please try again.";
    }
  });
}

/**
 * Gets the count for a specific reaction symbol from the post reactions array.
 *
 * @param {Array<object>} reactions - The reactions returned from the API.
 * @param {string} symbol - The reaction symbol to look up.
 * @returns {number} The count for the requested symbol.
 */
function getReactionCount(reactions, symbol) {
  const match = reactions.find((reaction) => reaction.symbol === symbol);
  return match?.count ?? 0;
}

/**
 * Renders the reaction buttons for the single post page.
 *
 * @param {Array<object>} [reactions=[]] - Array of reaction objects from the API.
 * @returns {string} HTML string for the reaction section.
 */
function renderReactionButtons(reactions = []) {
  return `
    <section class="post-reactions" aria-label="Post reactions">
      <h2 class="post-reactions__title">Reactions</h2>
      <div class="post-reactions__list">
        ${REACTIONS.map((symbol) => {
          const count = getReactionCount(reactions, symbol);

          return `
            <button
              type="button"
              class="post-reactions__button"
              data-reaction="${symbol}"
              aria-label="React with ${symbol}"
            >
              <span class="post-reactions__symbol">${symbol}</span>
              <span class="post-reactions__count">${count}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

/**
 * Attaches click handlers to reaction buttons and re-renders the post after toggling.
 *
 * @param {string|number} postId - The ID of the current post.
 * @returns {void}
 */
function attachReactionEvents(postId) {
  const reactionButtons = root.querySelectorAll("[data-reaction]");

  reactionButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const symbol = button.dataset.reaction;

      if (!symbol) return;

      try {
        button.disabled = true;
        const result = await reactToPost(postId, symbol);

       const updatedReaction = result.data.reactions.find(r => r.symbol === symbol);
       const newCount = updatedReaction?.count ?? 0;

       const countEl = button.querySelector(".post-reactions__count");
       if (countEl) {
           countEl.textContent = newCount;
    }  
      } catch (error) {
        console.error("Failed to update reaction:", error);
        window.alert("Unable to update reaction right now. Please try again.");
      } finally {
        button.disabled = false;
      }
    });
  });
}

/**
 * Fetches and renders a single post based on the ID in the URL.
 * Handles guest state, invalid ID state, missing post state, owner actions, comments, reactions, and errors.
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

    const comments = post.comments || [];
    const reactions = post.reactions || [];

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

      ${renderReactionButtons(reactions)}
      ${renderComments(comments)}
    `;

    attachReactionEvents(post.id);
    attachCommentForm(post.id);

    if (isOwner) {
      const actionsContainer = document.querySelector(".post__actions");

      if (actionsContainer) {
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
    }
  } catch (error) {
    console.error("Failed to load post:", error);
    root.innerHTML = "<p>Unable to load this post right now. Please try again shortly.</p>";
  }
}

renderPost();