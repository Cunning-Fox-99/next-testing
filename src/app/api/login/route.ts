import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Добавьте jwt для генерации токенов
import User from '@/models/User';
import connectDB from '@/config/database';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Используйте переменные окружения для секретного ключа

export async function POST(request: NextRequest) {
  await connectDB();
  const { email, password } = await request.json();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Генерация токена
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  
  // Установка токена в куки
  const response = NextResponse.json({ message: 'Login successful', user });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Установите true в production
      maxAge: 2592000, // Время жизни токена
      path: '/',
    })
  );

  return response;
}
