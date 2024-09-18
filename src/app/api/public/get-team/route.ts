import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import Team from '@/models/Team';

interface RequestBody {
    teamId: string;
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body: RequestBody = await request.json();
        const { teamId } = body;

        if (!teamId) {
            return new NextResponse('Team id not found', { status: 400 });
        }

        const team = await Team.findById(teamId).populate('members owner'); // Если нужно загрузить данные о пользователях

        if (!team) {
            return new NextResponse('Team not found', { status: 404 });
        }

        return new NextResponse(JSON.stringify(team), { status: 200 });
    } catch (e) {
        return new NextResponse('Server error', { status: 500 });
    }
}
