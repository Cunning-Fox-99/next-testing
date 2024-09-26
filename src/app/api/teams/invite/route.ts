import connectDB from "@/config/database";
import Team from "@/models/Team";
import User from "@/models/User";
import Notification from "@/models/Notification";
import Invitation from "@/models/Invitation";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import {NotificationType} from "@/types/notification.type";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
              const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
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

        // Создаем уведомление для приглашенного пользователя
        const notificationMessage = `You have been invited to join the team "${team.name}"`;
        const newNotification = new Notification({
            recipient: user._id,
            message: notificationMessage,
            type: NotificationType.TEAM_INVITATION, // Убедитесь, что у вас есть этот тип
            team: team._id,
            createdAt: new Date()
        });

        await newNotification.save();

        // Здесь можно отправить уведомление пользователю, например, по email

        return NextResponse.json({ message: 'Invitation sent' });
    } catch (error) {
        console.error('Error inviting user:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
