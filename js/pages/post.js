import { getPostById } from "../api/posts.js";

const root = document.getElementById("app");

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function renderPost() {
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

    root.innerHTML = `
      <article class="post">
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
      </article>
    `;
  } catch (error) {
    root.innerHTML = `<p>Error loading post: ${error.message}</p>`;
  }
}

renderPost();