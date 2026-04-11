import { getPosts } from "../api/posts.js";
import { getUserProfileByName } from "../api/profiles.js";
import { createPostCard } from "../components/postCard.js";
import { getToken } from "../storage/token.js";
import { getProfile } from "../storage/profile.js";
import { BASE_PATH } from "../api/config.js";

const root = document.getElementById("app");

async function getCurrentUserFollowState() {
  const storedProfile = getProfile();
  const currentUserName = storedProfile?.name?.trim() || "";

  if (!currentUserName) {
    return {
      currentUserName: "",
      followingNames: new Set(),
    };
  }

  try {
    const profile = await getUserProfileByName(currentUserName);

    const followingNames = new Set(
      (profile.following || [])
        .map((user) => user?.name?.trim().toLowerCase())
        .filter(Boolean)
    );

    return {
      currentUserName,
      followingNames,
    };
  } catch (error) {
    console.error("Failed to load current user follow state:", error);

    return {
      currentUserName,
      followingNames: new Set(),
    };
  }
}

function createFeedCardMarkup(post, followState) {
  const authorName = post.author?.name?.trim().toLowerCase() || "";
  const isFollowing = followState.followingNames.has(authorName);

  const actionMarkup = authorName
    ? `<button
         type="button"
         class="post-card__follow-btn"
         data-follow-author="${post.author.name}"
         aria-pressed="${isFollowing ? "true" : "false"}"
       >
         ${isFollowing ? "Following" : "Follow"}
       </button>`
    : "";

  return createPostCard(post, {
    actionMarkup,
    currentUserName: followState.currentUserName,
  });
}

async function renderFeed() {
  const token = getToken();

  if (!token) {
    root.innerHTML = `
      <section class="guest-state">
        <h1>Welcome</h1>
        <p>Please log in or register to view the posts.</p>
        <div class="guest-state__actions">
          <a class="button" href="${BASE_PATH}pages/login.html">Login</a>
          <a class="button" href="${BASE_PATH}pages/register.html">Register</a>
        </div>
      </section>
    `;
    return;
  }

  root.innerHTML = "<p>Loading...</p>";

  try {
    const [postsResponse, followState] = await Promise.all([
      getPosts({
        limit: 12,
        sort: "created",
        sortOrder: "desc",
      }),
      getCurrentUserFollowState(),
    ]);

    const posts = postsResponse.data || [];

    if (!posts.length) {
      root.innerHTML = "<p>No posts found.</p>";
      return;
    }

    root.innerHTML = `
      <section class="feed">
        <div class="feed__posts">
          ${posts.map((post) => createFeedCardMarkup(post, followState)).join("")}
        </div>
      </section>
    `;
  } catch (error) {
    console.error("Failed to load feed:", error);
    root.innerHTML = "<p>Unable to load posts right now. Please try again shortly.</p>";
  }
}

renderFeed();