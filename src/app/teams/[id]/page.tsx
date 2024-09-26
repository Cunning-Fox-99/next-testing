'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ITeam } from '@/types/team.type'; // Предполагаем, что тип TeamType уже определен

export default function TeamPage({ params }: { params: { id: string } }) {
    const [team, setTeam] = useState<ITeam | null>(null);
    const router = useRouter();

    const getTeam = async () => {
        try {
            const response = await fetch(`/api/public/get-team`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: params.id })
            });

            if (response.ok) {
                const data = await response.json();
                setTeam(data);
            } else {
                throw new Error('Error fetching team data');
            }
        } catch (error) {
            console.error('Ошибка при получении данных команды:', error);
        }
    };

    useEffect(() => {
        getTeam();
    }, []);

    if (!team) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gray-50 py-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Информация о команде */}
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <div className="flex items-center">
                        <img
                            src={team.portfolio?.[0] || '/default-team-image.png'} // Отображение первого изображения в портфолио или заглушки
                            alt={team.name}
                            className="h-24 w-24 rounded-full bg-gray-50 object-cover shadow-md"
                        />
                        <div className="ml-6">
                            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                            <p className="text-lg text-gray-600">{team.description || 'No description available'}</p>
                        </div>
                    </div>

                    {/* Время работы и рабочие дни */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-900">Work Schedule</h3>
                        <p className="text-gray-700 mt-1">Work Hours: {team.workHours || 'Not specified'}</p>
                        <p className="text-gray-700 mt-1">
                            Work Days: {team.workDays?.length ? team.workDays.join(', ') : 'Not specified'}
                        </p>
                    </div>

                    {/* Участники команды */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {team.members?.length ? (
                                team.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <img
                                                src={member.profileImage || '/default-profile.png'} // Если у участника нет фото
                                                alt={member.username}
                                                className="h-12 w-12 rounded-full bg-gray-50 object-cover shadow-sm"
                                            />
                                            <div className="ml-4">
                                                <p className="text-lg font-medium text-gray-900">{member.username}</p>
                                                <p className="text-sm text-gray-600">{member.profession || 'No profession specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No members in this team yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Портфолио команды */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900">Portfolio</h3>
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {team.portfolio?.length ? (
                                team.portfolio.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Portfolio item ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-lg transition-shadow"
                                    />
                                ))
                            ) : (
                                <p className="text-gray-600">No portfolio items available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
