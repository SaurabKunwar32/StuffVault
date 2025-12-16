const BASE_URL = "http://localhost:3000";

// Redirects user to GitHub OAuth login
export function loginWithGithub() {
  window.location.href = `${BASE_URL}/auth/github`;
}

