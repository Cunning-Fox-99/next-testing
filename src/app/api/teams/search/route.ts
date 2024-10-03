// app/api/teams/search/page.ts
import connectDB from "@/config/database";
import Team from "@/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const query = new URL(request.url).searchParams.get('query');

        const teams = await Team.find({
            name: { $regex: query, $options: 'i' },
            isSearchingOpen: true
        }).populate('owner').populate('members').exec();

        return NextResponse.json(teams);
    } catch (error) {
        console.error('Error searching teams:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
