export function renderComments(comments = []) {
  return `
    <section class="comments">
      <h2 class="comments__title">Comments (${comments.length})</h2>

      <form class="comments__form" id="comment-form">
        <label class="comments__label" for="comment-body">Add a comment</label>
        <textarea
          id="comment-body"
          name="comment-body"
          class="comments__textarea"
          rows="4"
          placeholder="Write your comment..."
          required
        ></textarea>
        <button type="submit" class="comments__submit">Post comment</button>
        <p class="comments__message" id="comment-message" aria-live="polite"></p>
      </form>

      ${
        comments.length
          ? `
            <ul class="comments__list">
              ${comments
                .map(
                  (comment) => `
                    <li class="comments__item">
                      <p class="comments__meta">
                        <strong>${comment.author?.name || "Unknown user"}</strong>
                      </p>
                      <p class="comments__body">${comment.body || ""}</p>
                    </li>
                  `
                )
                .join("")}
            </ul>
          `
          : `<p class="comments__empty">No comments yet. Be the first to comment!</p>`
      }
    </section>
  `;
}