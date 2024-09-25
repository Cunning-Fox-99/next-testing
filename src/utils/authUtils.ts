// authUtils.ts
import { NextRequest } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

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
