// authUtils.ts
import { NextRequest } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const getUserIdFromRequest = (request: NextRequest): { userId?: string; authorized: boolean } => {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.authToken;

  if (!token) {
    return { authorized: false }; // Возвращаем объект с флагом авторизации
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return { userId: decoded.userId, authorized: true }; // Возвращаем userId и флаг авторизации
  } catch (err) {
    return { authorized: false }; // Возвращаем объект с флагом авторизации
  }
};

export function getUserIdFromCookies(cookieHeader: string) {
  try {
    const cookies = parse(cookieHeader);
    const token = cookies['auth-token']; // Здесь 'auth-token' - это имя вашего токена в куках

    if (!token) {
      return { authorized: false };
    }

    const decoded:any = jwt.verify(token, JWT_SECRET);
    return { authorized: true, userId: decoded.userId };
  } catch (error) {
    return { authorized: false };
  }
}
