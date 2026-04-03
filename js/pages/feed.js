import { getPosts } from "../api/posts.js";

const root = document.getElementById("app");

async function renderFeed() {
  root.innerHTML = "<p>Loading...</p>";

  try {
    const response = await getPosts();
    const posts = response.data;

    if (!posts.length) {
      root.innerHTML = "<p>No posts found.</p>";
      return;
    }
 
    root.innerHTML = posts
      .map( 
      (post) => `
      <article>
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        </article>
        `
        )
        .join("");
  } catch (error) {
    root.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

renderFeed();