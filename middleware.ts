import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Allow the site to be embedded in the Arena Live Preview iframe,
// and set lenient cross-origin isolation for development so that
// cross-origin CSS/JS/images inside the preview sandbox don't fail.
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "ALLOWALL");
  res.headers.set("Content-Security-Policy", "frame-ancestors * 'self';");
  res.headers.delete("Cross-Origin-Opener-Policy");
  res.headers.delete("Cross-Origin-Embedder-Policy");
  res.headers.delete("Cross-Origin-Resource-Policy");
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
