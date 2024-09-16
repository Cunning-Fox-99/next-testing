// authUtils.ts
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const getUserIdFromRequest = (request: NextRequest): { userId: string } | NextResponse => {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.authToken;

  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return { userId: decoded.userId };
  } catch (err) {
    return new NextResponse('Invalid token', { status: 401 });
  }
};
