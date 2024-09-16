// app/api/teams/create/route.ts
import connectDB from "@/config/database";
import Team from "@/models/Team";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        if (userIdResult instanceof NextResponse) {
            return userIdResult;
        }

        const { userId } = userIdResult;
        const body = await request.json();
        const { name, description, workHours, workDays } = body;

        if (!name || !description) {
            return new NextResponse('Name and description are required', { status: 400 });
        }

        const newTeam = new Team({
            name,
            description,
            workHours,
            workDays,
            owner: userId,
            members: [userId]
        });

        await newTeam.save();

        return NextResponse.json({ message: 'Team created', team: newTeam });
    } catch (error) {
        console.error('Error creating team:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
