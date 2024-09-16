import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(request: NextRequest) {
  // Удаление токена
  const response = NextResponse.json({ message: 'Logout successful' });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Устанавливаем maxAge в 0 для удаления куки
      path: '/',
    })
  );

  return response;
}
