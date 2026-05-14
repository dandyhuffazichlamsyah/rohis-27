const COOKIE_NAME = "rohis_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getKey(secret: string) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSessionToken(secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const key = await getKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${timestamp}:${sigHex}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const [timestamp, sigHex] = token.split(":");
  if (!timestamp || !sigHex) return false;

  const ts = parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return false;
  if (Date.now() - ts > SESSION_DURATION_MS) return false;

  const key = await getKey(secret);
  const encoder = new TextEncoder();
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const expectedHex = Array.from(new Uint8Array(expectedSig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (sigHex.length !== expectedHex.length) return false;
  let match = true;
  for (let i = 0; i < sigHex.length; i++) {
    if (sigHex[i] !== expectedHex[i]) match = false;
  }
  return match;
}

export function getCookieName() {
  return COOKIE_NAME;
}
