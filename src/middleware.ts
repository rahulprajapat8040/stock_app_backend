// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Base_Url } from "./utils/constans";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Protect only /admin routes
    if (pathname.startsWith("/admin")) {
        const token = req.cookies.get("accessToken")?.value;

        // No token → redirect to login
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            // Call your backend API to validate token
            const res = await fetch(`${Base_Url}/auth/validate-session`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(res.ok)
            // If token is invalid or expired → redirect to login
            if (!res.ok) {
                return NextResponse.redirect(new URL("/login", req.url));
            }
        } catch (err) {
            console.error("Session validation error:", err);
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Allow request to continue
    return NextResponse.next();
}

// Apply middleware only to /admin routes
export const config = {
    matcher: ["/admin/:path*"],
};
