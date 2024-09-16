import connectDB from "@/config/database";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import User from "@/models/User";

interface RequestBody {
	password: string;
  }

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const userIdResult = getUserIdFromRequest(request);
	  
		if (userIdResult instanceof NextResponse) {
		  return userIdResult; 
		}
	  
		const { userId } = userIdResult;
		const body: RequestBody = await request.json();
		const { password } = body;
	  
		if (!password || password.length < 8) {
		  return new NextResponse('Password must be at least 8 characters long', { status: 400 });
		}
	  
		const hashedPassword = await bcrypt.hash(password, 10);
		const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
	  
		if (!updatedUser) {
		  return new NextResponse('User not found', { status: 404 });
		}
	  
		return NextResponse.json({ message: 'Password updated successfully' });
	  } catch (error) {
		console.error('Error updating password:', error);
		return new NextResponse('Internal server error', { status: 500 });
	  }
}