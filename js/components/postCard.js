import { ROUTES } from "../config/routes.js";

/**
 * Generates HTML markup for a reusable post card component.
 * Handles optional media, trims long body text, and conditionally
 * displays action buttons based on ownership.
 *
 * @param {object} post - The post data object.
 * @param {object} [options={}] - Optional configuration for rendering.
 * @param {string} [options.actionMarkup] - HTML string for additional actions (e.g. follow button).
 * @param {string} [options.currentUserName] - Name of the currently logged-in user.
 * @returns {string} HTML string representing the post card.
 */
export function createPostCard(post, options = {}) {
  const {
    actionMarkup = "",
    currentUserName = "",
  } = options;

  const trimmedBody =
    post.body && post.body.length > 120
      ? `${post.body.slice(0, 120).trim()}...`
      : post.body || "";

  const author = post.author?.name || "Unknown author";
  const media = post.media?.url || "";
  const alt = post.media?.alt || post.title || "Post image";
  const commentCount = post._count?.comments ?? 0;
  const isOwner =
  currentUserName &&
  author &&
  currentUserName.trim().toLowerCase() === author.trim().toLowerCase();
 
 return `
  <article class="post-card">
    <a
      class="post-card__media-link"
      href="${ROUTES.post(post.id)}"
      aria-label="View post: ${post.title || "Untitled Post"}"
    >
      ${
        media
          ? `<img
              class="post-card__image"
              src="${media}"
              alt="${alt}"
              fetchpriority="high"
            >`
          : ""
      }
    </a>

    <div class="post-card__content">
      <a class="post-card__content-link" href="${ROUTES.post(post.id)}">
        <h2 class="post-card__title">${post.title || "Untitled Post"}</h2>
        <p class="post-card__body">${trimmedBody}</p>
      </a>

      <div class="post-card__meta">
        <a
          class="post-card__author"
          href="${ROUTES.profile(author)}"
        >
          By ${author}
        </a>

        ${
          !isOwner && actionMarkup
            ? `<div class="post-card__actions">${actionMarkup}</div>`
            : ""
        }
      </div>

      <a class="post-card__comments" href="${ROUTES.post(post.id)}">
        Comments (${commentCount})
      </a>
    </div>
  </article>
`;
}