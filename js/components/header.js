import { getToken, removeToken } from "../storage/token.js";
import { removeApiKey } from "../storage/apiKey.js";
import { removeProfile } from "../storage/profile.js";
import { BASE_PATH } from "../api/config.js";

/**
 * Renders the site header navigation based on authentication state.
 * Shows profile, create, and logout options for logged-in users, and
 * login/register links for guests. Also attaches logout behavior.
 *
 * @returns {void}
 */
export function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const token = getToken();

  header.innerHTML = `
    <nav class="nav">
      <a href="${BASE_PATH}index.html" class="nav__brand">The Wire&trade;</a>
      <div class="nav__links">
        ${
         token
   ? `
      <a href="${BASE_PATH}pages/profile.html" class="nav__profile">Profile</a>
      <a href="${BASE_PATH}pages/create.html" class="nav__create">Create</a>
      <button id="logout-btn" type="button">Logout</button>
    `
            : `
              <a href="${BASE_PATH}pages/login.html">Login</a>
              <a href="${BASE_PATH}pages/register.html">Register</a>
            `
        }
      </div>
    </nav>
  `;

  if (token) {
    const logoutBtn = document.getElementById("logout-btn");

    logoutBtn?.addEventListener("click", () => {
      removeToken();
      removeApiKey();
      removeProfile();

        window.location.href = `${BASE_PATH}pages/login.html`;
    });
  }
}
