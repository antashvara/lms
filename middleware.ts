import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (role !== "admin") {
        return NextResponse.redirect(
          new URL("/login", req.url)
        );
      }
    }

    if (req.nextUrl.pathname.startsWith("/guru")) {
      if (role !== "guru") {
        return NextResponse.redirect(
          new URL("/login", req.url)
        );
      }
    }

    // SISWA
    if (req.nextUrl.pathname.startsWith("/siswa")) {
      if (role !== "siswa") {
        return NextResponse.redirect(
          new URL("/login", req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/guru/:path*",
    "/siswa/:path*",
  ],
};