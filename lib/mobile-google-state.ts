import { createHmac } from "crypto";

const STATE_SECRET = process.env.MOBILE_GOOGLE_STATE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

function base64UrlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Buffer {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  return Buffer.from(b64, "base64");
}

export function signState(payload: Record<string, unknown>): string {
  if (!STATE_SECRET) throw new Error("MOBILE_GOOGLE_STATE_SECRET or GOOGLE_CLIENT_SECRET required");
  const str = JSON.stringify(payload);
  const sig = createHmac("sha256", STATE_SECRET).update(str, "utf8").digest();
  return base64UrlEncode(Buffer.from(str, "utf8")) + "." + base64UrlEncode(sig);
}

export function verifyState(state: string): { returnUrl: string; code_verifier: string } {
  if (!STATE_SECRET) throw new Error("MOBILE_GOOGLE_STATE_SECRET or GOOGLE_CLIENT_SECRET required");
  const i = state.indexOf(".");
  if (i <= 0) throw new Error("Invalid state");
  const payloadB64 = state.slice(0, i);
  const sigB64 = state.slice(i + 1);
  const str = base64UrlDecode(payloadB64).toString("utf8");
  const expectedSig = createHmac("sha256", STATE_SECRET).update(str, "utf8").digest();
  if (sigB64 !== base64UrlEncode(expectedSig)) throw new Error("Invalid state signature");
  const parsed = JSON.parse(str) as { returnUrl: string; code_verifier: string; exp: number };
  if (parsed.exp < Date.now()) throw new Error("State expired");
  if (!parsed.returnUrl || typeof parsed.code_verifier !== "string") throw new Error("Invalid state payload");
  return { returnUrl: parsed.returnUrl, code_verifier: parsed.code_verifier };
}
