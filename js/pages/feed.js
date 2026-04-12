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
import { ROUTES } from "../config/routes.js";

const root = document.getElementById("app");
let allPosts = [];
let currentFollowState = null;
const MOBILE_BREAKPOINT = 768;

async function getCurrentUserFollowState() {
  const storedProfile = getProfile();
  const currentUserName = storedProfile?.name?.trim() || "";

  if (!currentUserName) {
    return {
      currentUserName: "",
      followingNames: new Set(),
      followingProfiles: [],
    };
  }

  try {
    const profile = await getUserProfileByName(currentUserName);

    const followingProfiles = profile.following || [];
    const followingNames = new Set(
      followingProfiles
        .map((user) => user?.name?.trim().toLowerCase())
        .filter(Boolean)
    );

    return {
      currentUserName,
      followingNames,
      followingProfiles,
    };
  } catch (error) {
    console.error("Failed to load current user follow state:", error);

    return {
      currentUserName,
      followingNames: new Set(),
      followingProfiles: [],
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

function createFollowingSidebarContent(followState) {
  const followingProfiles = [...followState.followingProfiles].sort((a, b) =>
    (a?.name || "").localeCompare(b?.name || "")
  );

  return `
    <div class="feed-sidebar__card">
      <h2 id="following-heading" class="feed-sidebar__title">Following</h2>

      ${
        followingProfiles.length
          ? `
            <ul class="feed-sidebar__list">
              ${followingProfiles
                .map((profile) => {
                  const name = profile?.name || "Unknown user";

                  return `
                    <li class="feed-sidebar__item">
                      <a
                        class="feed-sidebar__link"
                        href="${ROUTES.profile(name)}"
                      >
                        ${name}
                      </a>
                    </li>
                  `;
                })
                .join("")}
            </ul>
          `
          : `<p class="feed-sidebar__empty">You are not following anyone yet.</p>`
      }
    </div>
  `;
}

function renderPosts(postsToRender) {
  const postsContainer = root.querySelector(".feed__posts");
  if (!postsContainer || !currentFollowState) return;

  if (!postsToRender.length) { 
    postsContainer.innerHTML = "<p class='feed__empty'>No posts match your search.</p>";
    return;
  }

  postsContainer.innerHTML = postsToRender
    .map((post) => createFeedCardMarkup(post, currentFollowState))
    .join("");
}

function renderFollowingSidebar(followState) {
  const panel = root.querySelector("#following-panel");
  const toggleButton = root.querySelector(".feed-sidebar-toggle");

  if (panel) {
    panel.innerHTML = createFollowingSidebarContent(followState);
  }

  if (toggleButton) {
    toggleButton.textContent = `Following (${followState.followingProfiles.length})`;
  }
}

function isMobileView() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function syncSidebarVisibility() {
  const panel = root.querySelector("#following-panel");
  const toggleButton = root.querySelector(".feed-sidebar-toggle");

  if (!panel || !toggleButton) return;

  if (isMobileView()) {
    toggleButton.hidden = false;

    if (!panel.classList.contains("is-open")) {
      panel.hidden = true;
      toggleButton.setAttribute("aria-expanded", "false");
    }
  } else {
    toggleButton.hidden = true;
    toggleButton.setAttribute("aria-expanded", "false");
    panel.hidden = false;
    panel.classList.remove("is-open");
  }
}

function openMobileSidebar() {
  const panel = root.querySelector("#following-panel");
  const toggleButton = root.querySelector(".feed-sidebar-toggle");

  if (!panel || !toggleButton) return;

  panel.hidden = false;
  panel.classList.add("is-open");
  toggleButton.setAttribute("aria-expanded", "true");
}

function closeMobileSidebar() {
  const panel = root.querySelector("#following-panel");
  const toggleButton = root.querySelector(".feed-sidebar-toggle");

  if (!panel || !toggleButton) return;

  panel.classList.remove("is-open");
  panel.hidden = true;
  toggleButton.setAttribute("aria-expanded", "false");
}

function handleOutsideSidebarClick(event) {
  if (!isMobileView()) return;

  const panel = root.querySelector("#following-panel");
  const toggleButton = root.querySelector(".feed-sidebar-toggle");

  if (!panel || !toggleButton) return;
  if (panel.hidden) return;

  const clickedInsidePanel = panel.contains(event.target);
  const clickedToggle = toggleButton.contains(event.target);

  if (!clickedInsidePanel && !clickedToggle) {
    closeMobileSidebar();
  }
}

function updateFollowButtons(authorName, isFollowing, followState) {
  if (!authorName) return;

  const normalizedAuthorName = authorName.trim().toLowerCase();

  if (isFollowing) {
    followState.followingNames.add(normalizedAuthorName);

    const alreadyExists = followState.followingProfiles.some(
      (profile) => profile?.name?.trim().toLowerCase() === normalizedAuthorName
    );

    if (!alreadyExists) {
      followState.followingProfiles.push({ name: authorName });
    }
  } else {
    followState.followingNames.delete(normalizedAuthorName);
    followState.followingProfiles = followState.followingProfiles.filter(
      (profile) => profile?.name?.trim().toLowerCase() !== normalizedAuthorName
    );
  }

  const buttons = root.querySelectorAll(
    `[data-follow-author="${CSS.escape(authorName)}"]`
  );

  buttons.forEach((button) => {
    button.textContent = isFollowing ? "Following" : "Follow";
    button.setAttribute("aria-pressed", isFollowing ? "true" : "false");
    button.disabled = false;
  });

  renderFollowingSidebar(followState);
}

function attachFeedEvents(followState) {
  root.addEventListener("click", async (event) => {
    const toggleButton = event.target.closest(".feed-sidebar-toggle");
    if (toggleButton) {
      if (!isMobileView()) return;

      const isOpen = toggleButton.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }

      return;
    }

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

  window.addEventListener("resize", syncSidebarVisibility);
  document.addEventListener("click", handleOutsideSidebarClick);
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

  allPosts = postsResponse.data || [];
  currentFollowState = followState;

  if (!allPosts.length) {
    root.innerHTML = "<p>No posts found.</p>";
    return;
  }

  root.innerHTML = `
    <section class="feed-layout">
      <button
        class="feed-sidebar-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="following-panel"
        hidden
      >
        Following (${followState.followingProfiles.length})
      </button>

      <aside
        id="following-panel"
        class="feed-sidebar-panel"
        aria-labelledby="following-heading"
      ></aside>

      <section class="feed-main" aria-labelledby="feed-heading">
        <h1 id="feed-heading" class="feed-main__title">Latest posts</h1>

        <input
          type="search"
          class="feed-search"
          placeholder="Search posts..."
          aria-label="Search posts"
        >

        <div class="feed__posts">
          ${allPosts.map((post) => createFeedCardMarkup(post, followState)).join("")}
        </div>
      </section>
    </section>
  `;

  renderFollowingSidebar(followState);
  syncSidebarVisibility();
  attachFeedEvents(followState);

  const searchInput = root.querySelector(".feed-search");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.trim().toLowerCase();

      if (!searchTerm) {
        renderPosts(allPosts);
        return;
      }

      const filteredPosts = allPosts.filter((post) => {
        const title = post.title?.toLowerCase() || "";
        const body = post.body?.toLowerCase() || "";

        return title.includes(searchTerm) || body.includes(searchTerm);
      });

      renderPosts(filteredPosts);
    });
  }

} catch (error) {
  console.error("Failed to load feed:", error);
  root.innerHTML = "<p>Unable to load posts right now. Please try again shortly.</p>";
}
}

renderFeed();