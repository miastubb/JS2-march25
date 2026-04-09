import { getPosts } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";

const root = document.getElementById("app");

async function renderFeed() {
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