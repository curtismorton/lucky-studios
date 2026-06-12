import { NextRequest, NextResponse } from "next/server";
import { createCmsMiddlewareClient } from "@/lib/cms/supabase-ssr";

function isPublicCmsPath(pathname: string): boolean {
  return (
    pathname === "/cms/login" ||
    pathname.startsWith("/api/cms/auth/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/cms/login", request.nextUrl.origin));
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/cms", request.nextUrl.origin));
  }

  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    if (isPublicCmsPath(pathname)) {
      return NextResponse.next();
    }

    // Create a response early so the SSR client can write refreshed session
    // cookies back to the browser on any valid request.
    const response = NextResponse.next();
    const supabase = createCmsMiddlewareClient(request, response);

    // getUser() validates the JWT with Supabase (safe for protected routes).
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const nextUrl = `${pathname}${search || ""}`;
      const loginUrl = new URL("/cms/login", request.nextUrl.origin);
      loginUrl.searchParams.set("next", nextUrl);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/cms/:path*"],
};
