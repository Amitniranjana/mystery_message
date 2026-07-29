import { NextRequest, NextResponse } from "next/server";
import User from '@/app/model/model.user'
import dbConnect from "@/app/model/connection";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { generateAccessToken, generateRefreshToken } from "../../../../lib/auth";



export async function POST(req: NextRequest) {
    try {
        // 1. Database ko await karein
        await dbConnect();

        // 2. req.json() ko try-catch ke andar rakhein
        const data = await req.json();

        if (!data || !data.gmail) {
            return NextResponse.json(
                { message: "Data or gmail not provided to backend" },
                { status: 400 } // Bad Request
            );
        }

        // 3. await lagana zaruri hai
        const user = await User.findOne({ gmail: data.gmail });

        if (!user) {
            // Note: User na milne par 404 zyada sahi status code hai, 500 nahi
            return NextResponse.json(
                { message: "Mail does not exist, required to sign up" },
                { status: 404 }
            );
        }
        const passwordCheck = await bcrypt.compare(data.password, user.password);

        if (!passwordCheck) {
            return NextResponse.json({
                message: "password is incorrect"
            }, { status: 400 })
        }
        const tokenData = {
            id: data._id,
            gmail: data.gmail,

        }
        //generate access token

        const accessToken:string= await generateAccessToken(tokenData);
        const refreshToken:string= await generateRefreshToken(tokenData);


        const response = NextResponse.json(
            { message: "User signin successfull" },
            { status: 200 }
        );

        // set cookies

        response.cookies.set("accessToken", accessToken, {
            secure:process.env.NODE_ENV === 'production',
            httpOnly: true,
            path:'/',
            sameSite:'strict',


        })
        response.cookies.set('refreshToken' ,refreshToken,{
            httpOnly:true,
            path:'api/verify',
            sameSite:'strict',
            secure:process.env.NODE_ENV === 'production',
        })
        // 4. Agar user mil gaya, toh success response bhejein
return response

    } catch (err) {
        // Error handling
        return NextResponse.json(
            { message: "Something went wrong", error: err },
            { status: 500 }
        );
    }
}