import { loginUser } from "../api/auth.js";


  const form = document.querySelector("form");
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