export function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("invalid login credentials")) return "The email or password is incorrect.";
  if (message.includes("email not confirmed")) return "Confirm your email address before signing in.";
  if (message.includes("network") || message.includes("fetch")) return "We could not reach the authentication service. Check your connection and try again.";
  if (message.includes("expired") || message.includes("refresh token")) return "Your session has expired. Please sign in again.";
  return "We could not sign you in. Please check your details and try again.";
}