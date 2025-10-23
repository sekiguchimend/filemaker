export const AUTH_STORAGE_KEY = 'auth-demo';

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function loginDemo(username: string, password: string): boolean {
  const DEMO_USERNAME = 'demo';
  const DEMO_PASSWORD = 'demo123';
  if (typeof window === 'undefined') return false;
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}



