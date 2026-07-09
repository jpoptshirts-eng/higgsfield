export const AUTH_COOKIE = "portfolio-auth";

export function getAuthToken(): string {
  const password = process.env.SITE_PASSWORD ?? "";
  return Buffer.from(`portfolio:${password}`).toString("base64url");
}

export function isValidAuthToken(token: string | undefined): boolean {
  if (!token || !process.env.SITE_PASSWORD) return false;
  return token === getAuthToken();
}

export function isPasswordValid(password: string): boolean {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) return false;
  return password === expected;
}
