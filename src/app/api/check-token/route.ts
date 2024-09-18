import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    const cookies = parse(req.headers.get('cookie') || '');
    const authToken = cookies.authToken || null;

    if (!authToken) {
        return NextResponse.json({ isValid: false }, { status: 401 });
    }

    try {
        jwt.verify(authToken, process.env.JWT_SECRET as string);
        return NextResponse.json({ isValid: true });
    } catch (error) {
        return NextResponse.json({ isValid: false }, { status: 401 });
    }
}
