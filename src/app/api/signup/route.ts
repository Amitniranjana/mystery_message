import dbConnect from '@/app/model/connection';
import { NextRequest, NextResponse } from "next/server";
import User from '@/app/model/model.user';
import bcrypt from 'bcryptjs';

// Data create karne ke liye hamesha POST request ka use karein
export async function POST(req: NextRequest) {
    try {
        // 1. Database se connect karein
        await dbConnect();

        // 2. Frontend se aaya hua data padhein
        const data= await req.json();

        // Support both `email` and `gmail` keys from frontend


        // Basic validation
        if (!data.gmail || !data.password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const hashedPassword=await bcrypt.hash(data.password ,10);

        // 3. Check karein ki user pehle se toh nahi hai
        const existingUser = await User.findOne({ gmail: data.gmail });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with this email" },
                { status: 400 }
            );
        }

        // 4. Naya user create karein (apne model ke hisaab se fields pass karein)


        const newUser = new User({
            gmail: data.gmail,
            username:data.username,
            password: hashedPassword,
            gender: data.gender,
            message:data.message
        });

        // 5. Database mein save karein (await lagana zaroori hai)
        await newUser.save();

        // 6. Success response bhejein
        return NextResponse.json(
            { message: "User created successfully!" },
            { status: 201 }
        );

    } catch (err) {
        // Error aane par frontend ko batayein
        console.error("Signup API Error:", err);
        return NextResponse.json(
            { message: "Server Error", error: err },
            { status: 500 } // 500 ka matlab hota hai "Internal Server Error"
        );
    }
}