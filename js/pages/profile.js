import { getProfile } from "../storage/profile.js";
import { getPostsByProfile } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";
import { requireAuth } from "../auth/guard.js";
import { getUserProfileByName } from "../api/profiles.js";

requireAuth();

const root = document.getElementById("app");

async function renderProfile() {
  root.innerHTML = "<p>Loading profile...</p>";

const params = new URLSearchParams(window.location.search);
const profileNameFromURL = params.get("name");
const storedProfile = getProfile();

if (!storedProfile) {
  root.innerHTML = "<p>User not found.</p>";
  return;
}

const currentUsername = storedProfile.name;
const username = profileNameFromURL || currentUsername;
const isOwnProfile = username === currentUsername;

  try {
     const profileData = await getUserProfileByName(username);

     const response = await getPostsByProfile(username, { limit: 20 });
     const userPosts = response.data || [];

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
          <p class="profile__email">${profileData.email || ""}</p>
          <p class="profile__meta">${userPosts.length} posts</p>
        </aside>

        <section class="profile-content">
          <h2>${isOwnProfile ? "Your posts" : `${username}'s posts`}</h2>

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