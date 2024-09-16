import connectDB from '@/config/database';
import cookie from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { getUserIdFromRequest } from '@/utils/authUtils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface RequestBody {
	link: string;
  }

export async function POST(request: NextRequest) {
	await connectDB();
	const userIdResult = getUserIdFromRequest(request);

	if (userIdResult instanceof NextResponse) {
	  return userIdResult; 
	}
  
	const { userId } = userIdResult;

	  const body: RequestBody = await request.json();
	  const { link } = body;

	  let user = await User.findByIdAndUpdate(userId, {profileImage: link})

	//   if (!user) {
	// 	return new NextResponse('User not found', { status: 404 });
	//   }

	//   user.profileImage = link
	//   await user.save();
	  return new NextResponse('Profile image updated', { status: 200 });
}