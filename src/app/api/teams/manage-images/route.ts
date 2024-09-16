// app/api/teams/manage-images/route.ts
import connectDB from "@/config/database";
import Team from "@/models/Team";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

interface ManageImageRequestBody {
    teamId: string;
    imageUrl: string;
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        if (userIdResult instanceof NextResponse) {
            return userIdResult;
        }

        const { userId } = userIdResult;
        const body: ManageImageRequestBody = await request.json();
        const { teamId, imageUrl } = body;

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return new NextResponse('Team not found', { status: 404 });
        }

        if (!team.owner.equals(userId)) {
            return new NextResponse('Only the team owner can manage images', { status: 403 });
        }

        team.portfolio.push(imageUrl);
        await team.save();

        return NextResponse.json({ message: 'Image added', portfolio: team.portfolio });
    } catch (error) {
        console.error('Error adding image:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        if (userIdResult instanceof NextResponse) {
            return userIdResult;
        }

        const { userId } = userIdResult;
        const body: ManageImageRequestBody = await request.json();
        const { teamId, imageUrl } = body;

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return new NextResponse('Team not found', { status: 404 });
        }

        if (!team.owner.equals(userId)) {
            return new NextResponse('Only the team owner can manage images', { status: 403 });
        }

        // Удаление изображения
        team.portfolio = team.portfolio.filter((url: string) => url !== imageUrl);
        await team.save();

        return NextResponse.json({ message: 'Image removed', portfolio: team.portfolio });
    } catch (error) {
        console.error('Error removing image:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}