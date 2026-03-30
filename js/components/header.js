import { getToken, removeToken } from "../storage/token.js";
import { BASE_PATH } from "../api/config.js";

export function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const token = getToken();

  header.innerHTML = `
    <nav class="nav">
      <a href="${BASE_PATH}index.html" class="nav__brand">App</a>
      <div class="nav__links">
        ${
          token
            ? `
              <a href="${BASE_PATH}pages/profile.html">Profile</a>
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
      window.location.href = `${BASE_PATH}index.html`;
    });
  }
}
