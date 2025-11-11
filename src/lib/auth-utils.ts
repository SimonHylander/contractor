/**
 * Client-side cookie utilities for user session management
 */

const COOKIE_NAME = "cc_user_id";

/**
 * Set the user ID in a cookie
 */
export function setUserIdCookie(userId: string) {
  // Set cookie with 1 year expiration
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_NAME}=${userId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get the user ID from cookie
 */
export function getUserIdCookie(): string | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === COOKIE_NAME) {
      return value ?? null;
    }
  }
  return null;
}

/**
 * Remove the user ID cookie
 */
export function removeUserIdCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
