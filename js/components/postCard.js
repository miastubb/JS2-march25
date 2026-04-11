import { ROUTES } from "../config/routes.js";

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
          <p class="post-card__author">By ${author}</p>
          ${
            !isOwner && actionMarkup
             ? `<div class="post-card__actions">${actionMarkup}</div>` : ""}
        </div>
      </div>
    </article>
  `;
}