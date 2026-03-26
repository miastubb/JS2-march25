const PROFILE_KEY = 'userProfile';

export function saveUserProfile(profile) {
  if (!profile) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile() {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function removeProfile() {
  localStorage.removeItem(PROFILE_KEY);
}
