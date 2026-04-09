import { getPosts } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";
import { getToken } from "../storage/token.js";
import { BASE_PATH } from "../api/config.js";

const root = document.getElementById("app");

async function renderFeed() {
  const token = getToken();

  if (!token) {
    root.innerHTML = `
      <section class="guest-state">
        <h1>Welcome</h1>
        <p>Please log in or register to view the posts.</p>
        <div class="guest-state__actions">
          <a class="button" href="${BASE_PATH}account/login.html">Login</a>
          <a class="button" href="${BASE_PATH}account/register.html">Register</a>
        </div>
      </section>
    `;
    return;
  }

  root.innerHTML = "<p>Loading...</p>";

  try {
    const response = await getPosts({
      limit: 12,
      sort: "created",
      sortOrder: "desc",
    });

    const posts = response.data;

    if (!posts.length) {
      root.innerHTML = "<p>No posts found.</p>";
      return;
    }

    root.innerHTML = posts.map(createPostCard).join("");
  } catch (error) {
    console.error("Failed to load feed:", error);
    root.innerHTML = "<p>Unable to load posts right now. Please try again shortly.</p>";
  }
}

renderFeed();