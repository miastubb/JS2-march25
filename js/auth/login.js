import { loginUser } from "../api/auth.js";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

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