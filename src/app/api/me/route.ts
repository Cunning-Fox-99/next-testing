import connectDB from '@/config/database';
import cookie from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { getUserIdFromRequest } from '@/utils/authUtils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
	await connectDB();
	const userIdResult = getUserIdFromRequest(request);

	if (userIdResult instanceof NextResponse) {
	  return userIdResult; 
	}
  
	const { userId } = userIdResult;

	  let user = await User.findById(userId).select('-password -_id');

	  if (!user) {
		return new NextResponse('User not found', { status: 404 });
	  }

  return NextResponse.json( user );
}
