import User from '@/app/model/model.user';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("accessToken")?.value;

        // 1. If token is missing, clear cookies anyway and return 401
        if (!token) {
            const response = NextResponse.json(
                { message: "No access token found, logging out." },
                { status: 401 }
            );
            clearAuthCookies(response);
            return response;
        }

        const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET_KEY!);

        try {
            // 2. Token decode & verify
            const { payload } = await jwtVerify(token, secret);
            const userId = payload.id || payload._id; // Handles both `id` or `_id`

            // 3. Clear DB refreshToken
            if (userId) {
                await User.findByIdAndUpdate(
                    userId,
                    { refreshToken: null },
                    { new: true }
                ).select('-password');
            }
        } catch (jwtErr) {
            // Token expire ho gaya ho fir bhi niche cookies clear ho jayengi
            console.log("Token invalid or expired during logout, clearing local session." , jwtErr);
        }

        // 4. Create Success Response
        const response = NextResponse.json(
            { message: 'Logout successfully' },
            { status: 200 }
        );

        // 5. Clear BOTH Cookies from browser
        clearAuthCookies(response);

        return response;

    } catch (err) {
        return NextResponse.json(
            { message: "Problem in logout" },
            { status: 500 }
        );
    }
}