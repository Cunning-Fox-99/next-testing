import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
  const cookies = request.headers.get('cookie');
  const parsedCookies = cookies ? cookie.parse(cookies) : {};
  const token = parsedCookies.authToken;

  console.log('Token:', token);

  if (token) {
    try {
      // Используем jose для проверки токена
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      console.log('Token is valid');
      // Если токен верен, продолжаем запрос
      return NextResponse.next();
    } catch (err) {
      console.error('JWT verification error:', err);
      // Неверный токен
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  console.log('No token found');
  // Если нет токена, перенаправляем на страницу входа
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: '/dashboard/:path*',
};
