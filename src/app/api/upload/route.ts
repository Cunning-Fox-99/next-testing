import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { getUserIdFromRequest } from '@/utils/authUtils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  await connectDB();

  const userIdResult = getUserIdFromRequest(request);

  if (userIdResult instanceof NextResponse) {
    return userIdResult; 
  }

  const { userId } = userIdResult;

  try {
    const { url } = await request.json();
    if (!url) {
      return new NextResponse('URL is required', { status: 400 });
    }

    // Save URL to the user's record in the database
    await User.findByIdAndUpdate(userId, { $push: { images: url } });

    return new NextResponse('Image URL saved successfully');
  } catch (error) {
    console.error('Error saving URL:', error);
    return new NextResponse('Error saving image URL', { status: 500 });
  }
}
