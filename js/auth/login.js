import { loginUser } from "../api/auth.js";

const root = document.getElementById("app");

root.innerHTML = `
  <section class="auth-page">
    <div class="auth-card">
      <h1>Login</h1>

      <form id="loginForm" novalidate>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>

        <button class="btn btn--primary" type="submit">Login</button>
        <p class="form-error" data-form-error aria-live="assertive"></p>

        <p class="auth-alt">
          Need an account? <a href="./register.html">Register here</a>
        </p>
      </form>
    </div>
  </section>
`;

const form = document.getElementById("loginForm");
const formError = document.querySelector("[data-form-error]");

function validateLogin({ email, password }) {
  if (!email || !password) {
    formError.textContent = "Please enter both email and password";
    return false;
  }

  return true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";

  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;

  if (!validateLogin({ email, password })) return;

  try {
    await loginUser(email, password);
    window.location.href = "../index.html";
  } catch (error) {
    formError.textContent = error.message || "Login failed";
  }
});