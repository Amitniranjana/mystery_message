import User from '@/app/model/model.user'
import dbConnect from '@/app/model/connection';
import { NextRequest, NextResponse } from 'next/server'

export  async function POST(req:NextRequest){
    await dbConnect();
    const {username}=await req.json();
    try{
const user=await User.findOne({username});
if(user){
   return NextResponse.json({
    message:"username is not avalable"
},{status:200})
}
return NextResponse.json({
    message:"username is available "
},{status:200})
    }catch(error){
        console.log(error)
return NextResponse.json({
    message:"error in getting the usrname for debouncing"
},{status:404})
    }
}