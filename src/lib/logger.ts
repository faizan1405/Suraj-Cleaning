type LogLevel = "info" | "warn" | "error";

const SENSITIVE_KEYS = new Set([
  "password", "secret", "token", "signature", "payload", "notes",
  "MONGODB_URI", "RAZORPAY_KEY_SECRET", "CLOUDINARY_API_SECRET",
  "GOOGLE_CLIENT_SECRET", "ADMIN_SESSION_SECRET", "NEXTAUTH_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
]);

function redact(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const isSecret = [...SENSITIVE_KEYS].some(
      (s) => k.toLowerCase().includes(s.toLowerCase())
    );
    out[k] = isSecret ? "[REDACTED]" : redact(v);
  }
  return out;
}

function fmt(level: string, msg: string, meta?: unknown): string {
  const ts = new Date().toISOString();
  const clean = meta !== undefined ? JSON.stringify(redact(meta)) : "";
  return `[${ts}] [${level}] ${msg}${clean ? " " + clean : ""}`;
}

export const logger = {
  info(message: string, meta?: unknown) { console.log(fmt("INFO", message, meta)); },
  warn(message: string, meta?: unknown) { console.warn(fmt("WARN", message, meta)); },
  error(message: string, meta?: unknown) { console.error(fmt("ERROR", message, meta)); },
};

export default logger;
