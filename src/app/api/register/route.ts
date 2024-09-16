import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '@/models/User';
import connectDB from '@/config/database';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  await connectDB();
  const { email, password } = await request.json();

  // Проверка существующего пользователя
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Хэширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создание нового пользователя
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  // Генерация токена
  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

  // Установка токена в куки
  const response = NextResponse.json({ message: 'Registration successful', user: newUser });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    })
  );

  return response;
}
