export function createPostCard(post) {
  const trimmedBody =
    post.body && post.body.length > 120
      ? `${post.body.slice(0, 120).trim()}...`
      : post.body || "";

  const author = post.author?.name || "Unknown author";
  const media = post.media?.url || "";
  const alt = post.media?.alt || post.title || "Post image";

  return `
    <article class="post-card">
      <a class="post-card__link" href="/pages/post.html?id=${post.id}">
        ${
          media
            ? `<img class="post-card__image" src="${media}" alt="${alt}">`
            : ""
        }
        <div class="post-card__content">
          <h2 class="post-card__title">${post.title || "Untitled Post"}</h2>
          <p class="post-card__body">${trimmedBody}</p>
          <p class="post-card__author">By ${author}</p>
        </div>
      </a>
    </article>
  `;
}