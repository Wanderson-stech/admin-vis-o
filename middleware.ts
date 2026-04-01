import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get("owner_auth")

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!authCookie || authCookie.value !== "authenticated") {
      const loginUrl = new URL("/", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If already logged in, redirect from login to dashboard
  if (pathname === "/") {
    if (authCookie && authCookie.value === "authenticated") {
      const dashboardUrl = new URL("/dashboard", request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
