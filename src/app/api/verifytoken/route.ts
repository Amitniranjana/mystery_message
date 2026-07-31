import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken } from "../../../../lib/auth";
const refreshSecretKey = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET_KEY);
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('refreshToken')?.value;
        if (!token) {
            return NextResponse.json({
                message: 'refresh token expired'
            }, { status: 401 })
        }

        // agar token ko verify nahi karpaya to wo sidha error throw karta hai joki catch block me jayega
        const decodedToken = await jwtVerify(token, refreshSecretKey);

        // 3. Extract ONLY custom claims / user info (avoid passing 'exp' & 'iat')
        const payload = decodedToken.payload
        const userPayload = {
            userId: payload.userId || payload.sub,
            email: payload.email,
            // Add other user fields needed in access token
        };
        const accessToken = await generateAccessToken(userPayload);
        const response = NextResponse.json({
            message: "accesstoken regenrate successfully"

        }, { status: 200 })
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return response
    } catch (err) {
        console.log('verify token Error', err)
        return NextResponse.json(
            { message: 'Invalid or tampered token' },
            { status: 401 }
        );
    }
}