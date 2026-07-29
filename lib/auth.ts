import { JWTPayload, SignJWT } from "jose";
import { NextResponse } from "next/server";
const refreshKey=  new TextEncoder().encode(process.env.JWT_REFRESH_SECRET_KEY);
const accessKey =  new TextEncoder().encode(process.env.JWT_ACCESS_SECRET_KEY);
export async function generateAccessToken(payload:JWTPayload){
    return (
        await new SignJWT(payload)
        .setProtectedHeader({alg:"HS256"})
        .setExpirationTime('15m')
        .setIssuedAt()
        .sign(accessKey)
    )
}

export async function generateRefreshToken(payload:JWTPayload){
    return (
        await new SignJWT(payload)
        .setProtectedHeader({alg:"HS256"})
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(refreshKey)
    )
}

export async function clearAuthCookies(response: NextResponse) {
    const isProd = process.env.NODE_ENV === 'production';

    // Clear Access Token
    response.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: isProd,
        expires: new Date(0),
        path: '/',
    });

    // Clear Refresh Token
    response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: isProd,
        expires: new Date(0),
        path: '/api/auth/refresh', // Match the path used during creation
    });
}