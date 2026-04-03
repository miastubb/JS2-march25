export function createPostCard(posts) {
  return `
    <article class="post-card">
      <h2 class="post-card__title">${post.title || "Untitled Post"}</h2>
      <p class="post-card__body">${post.body || ""}</p>
    </article>
  `;
}