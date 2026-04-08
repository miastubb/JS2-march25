import { getProfile } from "../storage/profile.js";
import { getPosts } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";
import { requireAuth } from "../auth/guard.js";

requireAuth();

const root = document.getElementById("app");

async function renderProfile() {
  root.innerHTML = "<p>Loading profile...</p>";

  const profile = getProfile();

  if (!profile) {
    root.innerHTML = "<p>User not found.</p>";
    return;
  }

  const username = profile.name;

  try {
    const response = await getPosts({ limit: 20 });
    const posts = response.data || [];

    const userPosts = posts.filter((post) => post.author?.name === username);

    const localAvatar = "../assets/images/profile-illustration-bw-cats.webp";
    const avatarMarkup = `<img
      src="${localAvatar}"
      alt="${username}"
      class="profile-sidebar__image"
      width="300"
      height="300"
      decoding="async"
    >`;

    root.innerHTML = `
      <section class="profile-layout">
        <aside class="profile-sidebar">
          <div class="profile-sidebar__avatar">
            ${avatarMarkup}
          </div>

          <h1 class="profile__title">${username}</h1>
          <p class="profile__email">${profile.email || ""}</p>
          <p class="profile__meta">${userPosts.length} posts</p>
        </aside>

        <section class="profile-content">
          <h2>Your posts</h2>

          <div class="profile__posts">
            ${
              userPosts.length
                ? userPosts.map(createPostCard).join("")
                : "<p>No posts yet.</p>"
            }
          </div>
        </section>
      </section>
    `;
  } catch (error) {
    root.innerHTML = `<p>Error loading profile: ${error.message}</p>`;
  }
}

renderProfile();