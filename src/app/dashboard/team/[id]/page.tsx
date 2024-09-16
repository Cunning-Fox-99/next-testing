'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';

const TeamPage = ({ params }: { params: { id: string } }) => {
   console.log(params)

    // Примерные данные команды
    const [team, setTeam] = useState({
        name: 'Team Alpha',
        description: 'A great team of photographers.',
        workHours: '9:00 AM - 6:00 PM',
        members: [
            { name: 'John Doe', contact: 'john@example.com' },
            { name: 'Jane Smith', contact: 'jane@example.com' },
        ],
        photos: [
            '/images/photo1.jpg',
            '/images/photo2.jpg',
            '/images/photo3.jpg',
        ],
    });

    const handleAddMember = () => {
        // Логика добавления участника
    };

    const handleRemoveMember = (index: number) => {
        // Логика удаления участника
    };

    const handleUpdateWorkHours = () => {
        // Логика установки рабочих часов
    };

    const handleAddPhoto = () => {
        // Логика добавления фотографии в галерею
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{team.name}</h1>

            {/* Gallery */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-3 gap-4">
                    {team.photos.map((photo, index) => (
                        <div key={index} className="relative">
                            <img src={photo} alt={`Team Photo ${index + 1}`} className="w-full h-48 object-cover rounded-md" />
                        </div>
                    ))}
                </div>
                <button
                    className="mt-4 flex items-center text-blue-500 hover:underline"
                    onClick={handleAddPhoto}
                >
                    <FaPlus className="mr-2" /> Add Photo
                </button>
            </div>

            {/* Description */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p>{team.description}</p>
            </div>

            {/* Work Hours */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Work Hours</h2>
                <p>{team.workHours}</p>
                <button
                    className="mt-4 flex items-center text-blue-500 hover:underline"
                    onClick={handleUpdateWorkHours}
                >
                    <FaPlus className="mr-2" /> Update Work Hours
                </button>
            </div>

            {/* Members */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Members</h2>
                <ul className="space-y-4">
                    {team.members.map((member, index) => (
                        <li key={index} className="p-4 border border-gray-200 rounded-md">
                            <p className="font-semibold">{member.name}</p>
                            <p>{member.contact}</p>
                            <button
                                className="mt-2 text-red-500 hover:underline"
                                onClick={() => handleRemoveMember(index)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    className="mt-4 flex items-center text-blue-500 hover:underline"
                    onClick={handleAddMember}
                >
                    <FaPlus className="mr-2" /> Add Member
                </button>
            </div>
        </div>
    );
};

export default TeamPage;
