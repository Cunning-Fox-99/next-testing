import connectDB from "@/config/database";
import Team from "@/models/Team";  // Импорт модели Team
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const query = new URL(request.url).searchParams.get('query');

        if (!query) {
            return new NextResponse('Query parameter is missing', { status: 400 });
        }

        const teams = await Team.find({
            name: { $regex: query, $options: 'i' },  // Поиск по названию команды (регистронезависимо)
        }).exec();

        return NextResponse.json(teams);
    } catch (error) {
        console.error('Error searching teams:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
