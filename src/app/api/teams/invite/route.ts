import connectDB from "@/config/database";
import Team from "@/models/Team";
import User from "@/models/User";
import Invitation from "@/models/Invitation";
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
        const { teamId, email } = body;

        if (!email) {
            return new NextResponse('Email is required', { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return new NextResponse('Team not found', { status: 404 });
        }

        if (!team.owner.equals(userId)) {
            return new NextResponse('Only the team owner can invite users', { status: 403 });
        }

        if (team.members.includes(user._id)) {
            return new NextResponse('User is already a member', { status: 400 });
        }

        // Создаем приглашение
        const invitation = new Invitation({
            teamId: team._id,
            userId: user._id,
            invitedBy: userId
        });

        await invitation.save();

        // Здесь можно отправить уведомление пользователю, например, по email

        return NextResponse.json({ message: 'Invitation sent' });
    } catch (error) {
        console.error('Error inviting user:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
