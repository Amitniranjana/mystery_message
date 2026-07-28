import { NextResponse } from "next/server"

export async function POST() {
    try {
        const response = NextResponse.json({
            message: 'logout successfully'
        }, { status: 200 });
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.JWT_SECRET === 'production',
            expires: new Date(0), // Instantly expires the cookie
            path: '/', // Ensures the cookie is cleared across the entire site
        })
        return response;
    } catch (err) {
        return NextResponse.json({
            message: "problem in logout"
        }, { status: 400 })
    }
}