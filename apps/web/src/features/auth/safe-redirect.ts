// Only same-origin paths are allowed, to prevent open redirects via ?redirect=.
// Parsing with URL catches variants the browser normalizes, such as "//evil.com", "/\\evil.com" or "/\t/evil.com".
export function safeRedirect(target: string | undefined) {
  if (target === undefined || !target.startsWith("/")) return "/";

  const base = "http://app.invalid";
  const url = new URL(target, base);

  if (url.origin !== base) return "/";

  return target;
}
