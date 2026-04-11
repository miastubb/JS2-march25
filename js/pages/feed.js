import { getPosts } from "../api/posts.js";
import {
  getUserProfileByName,
  followProfile,
  unfollowProfile,
} from "../api/profiles.js";
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

function createFollowButtonMarkup(authorName, isFollowing) {
  if (!authorName) return "";

  return `
    <button
      type="button"
      class="post-card__follow-btn"
      data-follow-author="${authorName}"
      aria-pressed="${isFollowing ? "true" : "false"}"
    >
      ${isFollowing ? "Following" : "Follow"}
    </button>
  `;
}

function createFeedCardMarkup(post, followState) {
  const authorName = post.author?.name?.trim() || "";
  const normalizedAuthorName = authorName.toLowerCase();
  const isFollowing = followState.followingNames.has(normalizedAuthorName);

  const actionMarkup = createFollowButtonMarkup(authorName, isFollowing);

  return createPostCard(post, {
    actionMarkup,
    currentUserName: followState.currentUserName,
  });
}

function updateFollowButtons(authorName, isFollowing, followState) {
  if (!authorName) return;

  const normalizedAuthorName = authorName.trim().toLowerCase();

  if (isFollowing) {
    followState.followingNames.add(normalizedAuthorName);
  } else {
    followState.followingNames.delete(normalizedAuthorName);
  }

  const buttons = root.querySelectorAll(
    `[data-follow-author="${CSS.escape(authorName)}"]`
  );

  buttons.forEach((button) => {
    button.textContent = isFollowing ? "Following" : "Follow";
    button.setAttribute("aria-pressed", isFollowing ? "true" : "false");
    button.disabled = false;
  });
}

function attachFeedEvents(followState) {
  root.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-follow-author]");
    if (!button) return;

    const authorName = button.dataset.followAuthor?.trim();
    if (!authorName) return;

    const isFollowing = button.getAttribute("aria-pressed") === "true";

    button.disabled = true;

    try {
      if (isFollowing) {
        await unfollowProfile(authorName);
        updateFollowButtons(authorName, false, followState);
      } else {
        await followProfile(authorName);
        updateFollowButtons(authorName, true, followState);
      }
    } catch (error) {
      console.error("Failed to update follow state:", error);
      button.disabled = false;
      window.alert("Unable to update follow status right now. Please try again.");
    }
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

    attachFeedEvents(followState);
  } catch (error) {
    console.error("Failed to load feed:", error);
    root.innerHTML = "<p>Unable to load posts right now. Please try again shortly.</p>";
  }
}

renderFeed();