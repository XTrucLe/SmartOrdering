import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_PATHS = ["/owner", "/admin", "/staff", "/manager"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("session-token")?.value;

  const isPrivatePath = PRIVATE_PATHS.some((path) => pathname.startsWith(path));

  if (isPrivatePath && !sessionToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
