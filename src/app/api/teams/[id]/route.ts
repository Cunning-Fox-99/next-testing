// app/api/teams/[id]/route.ts
import connectDB from "@/config/database";
import Team from "@/models/Team";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const team = await Team.findById(params.id).populate('owner').populate('members').exec();

        if (!team) {
            return new NextResponse('Team not found', { status: 404 });
        }

        const isOwner = team.owner._id.equals(userId);

        return NextResponse.json({ ...team.toObject(), isOwner });
    } catch (error) {
        console.error('Error fetching team:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
