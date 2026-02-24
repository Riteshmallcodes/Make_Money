const AUTH_STORAGE_KEY = 'makebuddy_auth';

export function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    };
  } catch {
    return { token: null, user: null };
  }
}

export function writeStoredAuth(token, user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

