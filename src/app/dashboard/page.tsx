'use client';

import React from 'react';
import Link from 'next/link';

const Dashboard = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Statistics */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Statistics</h2>
                    <ul className="mt-4 space-y-2">
                        <li>Total Projects: 10</li>
                        <li>Total Teams: 5</li>
                        <li>Active Chats: 3</li>
                    </ul>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Upcoming Events</h2>
                    <ul className="mt-4 space-y-2">
                        <li>Project Meeting - Sep 20, 2024</li>
                        <li>Team Collaboration - Sep 25, 2024</li>
                    </ul>
                </div>

                {/* Recent Projects */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Recent Projects</h2>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <Link className="text-blue-600 hover:underline" href="/dashboard/project/1">
                                Project Alpha
                            </Link>
                        </li>
                        <li>
                            <Link className="text-blue-600 hover:underline" href="/dashboard/project/2">
                               Project Beta
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Active Teams */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Active Teams</h2>
                    <ul className="mt-4 space-y-2">
                        <li>Team X</li>
                        <li>Team Y</li>
                    </ul>
                </div>

                {/* Notifications */}
                <div className="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <ul className="mt-4 space-y-2">
                        <li>New message in Chat 1</li>
                        <li>Project Alpha has been updated</li>
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                    <div className="mt-4 flex space-x-4">
                        <Link className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700" href="/dashboard/create-project">
                           Create Project
                        </Link>
                        <Link className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" href="/dashboard/create-team">
                           Create Team
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
