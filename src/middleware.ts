import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Protect only /admin routes
    if (pathname.startsWith("/admin")) {
        const token = req.cookies.get("accessToken")?.value;

        if (!token) {
            const loginUrl = new URL("/login", req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Define which routes should run this middleware
export const config = {
    matcher: ["/admin/:path*"],
};
