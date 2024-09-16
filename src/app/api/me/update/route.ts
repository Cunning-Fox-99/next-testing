// pages/api/me/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User'
import connectDB from "@/config/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === 'POST') {
        try {
            const { userId, ...updates } = req.body;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const user = await User.findByIdAndUpdate(userId, updates, { new: true });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
