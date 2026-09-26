// Only same-origin paths are allowed, to prevent open redirects via ?redirect=.
export function safeRedirect(target: string | undefined) {
  if (target === undefined || !target.startsWith("/")) return "/";

  if (target.startsWith("//") || target.startsWith("/\\")) return "/";

  return target;
}
