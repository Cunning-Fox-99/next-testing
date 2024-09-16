'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Modal from '@/components/Modal';
import { Team } from '@/types/team.type';

const TeamPage = ({ params }: { params: { id: string } }) => {
    const [isOwner, setIsOwner] = useState(true); // Заменить на реальную логику
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [team, setTeam] = useState<Team>({
        name: '',
        description: '',
        workHours: 'Not Set',
        members: [],
        portfolio: [],
    });
    const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
    const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
    const [emailToInvite, setEmailToInvite] = useState('');
    const [newTeamData, setNewTeamData] = useState({
        name: team.name,
        workHours: team.workHours,
        description: team.description,
        daysOff: selectedDays,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const fetchTeam = async () => {
        try {
            const response = await fetch(`/api/teams/${params.id}`);
            if (!response.ok) throw new Error('Failed to fetch team data');
            const data: Team = await response.json();
            console.log(data)
            setTeam(data);
            setSelectedDays(data.workDays || []);
            setNewTeamData({
                name: data.name,
                workHours: data.workHours,
                description: data.description,
                daysOff: data.workDays || [],
            });
            setIsOwner(data.isOwner || false);
        } catch (error) {
            console.error('Error fetching team:', error);
            setError('Failed to fetch team data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [params.id]);

    const handleDayClick = (day: string) => {
        setSelectedDays((prevDays) =>
            prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
        );
    };

    const handleAddPhoto = () => {
        document.getElementById('fileInput')?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                // Загрузка изображения на ImgBB
                const imgBBResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!imgBBResponse.ok) {
                    throw new Error(`Error uploading to ImgBB: ${imgBBResponse.statusText}`);
                }

                const imgBBData = await imgBBResponse.json();
                const fileUrl = imgBBData.data.url;

                // Сохранение URL изображения в базе данных
                const response = await fetch('/api/teams/manage-images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamId: params.id, imageUrl: fileUrl }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add image');
                }

                fetchTeam()
            } catch (error) {
                console.error('Error adding photo:', error);
            }
        }
    };


    const handleInviteMember = async () => {
        try {
            const response = await fetch('/api/teams/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: params.id, email: emailToInvite }),
            });
            if (!response.ok) throw new Error('Failed to invite member');
            setEmailToInvite('');
            setIsInviteMemberModalOpen(false);
        } catch (error) {
            console.error('Error inviting member:', error);
        }
    };

    const handleSaveTeamChanges = async () => {
        try {
            const response = await fetch(`/api/teams/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: params.id,
                    name: newTeamData.name,
                    workHours: newTeamData.workHours,
                    description: newTeamData.description,
                    daysOff: newTeamData.daysOff,
                }),
            });
            if (!response.ok) throw new Error('Failed to update team');
            fetchTeam()
            setIsEditTeamModalOpen(false);
        } catch (error) {
            console.error('Error updating team:', error);
            setError('Failed to update team');
        }
    };

    const handleDeletePhoto = async (photoUrl: string) => {
        try {
            const response = await fetch('/api/teams/manage-images', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: params.id, imageUrl: photoUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

           fetchTeam()
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{team.name || 'Team Name'}</h1>

            {/* Gallery */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-3 gap-4">
                    {team.portfolio && team.portfolio.length > 0 ? (
                        team.portfolio.map((photo, index) => (
                            <div key={index} className="relative">
                                <img src={photo} alt={`Team Photo ${index + 1}`}
                                     className="w-full h-48 object-cover rounded-md"/>
                                {isOwner && (
                                    <button
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                                        onClick={() => handleDeletePhoto(photo)}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No photos available.</p>
                    )}
                </div>
                {isOwner && (
                    <button
                        className="mt-4 flex items-center text-blue-500 hover:underline"
                        onClick={handleAddPhoto}
                    >
                        <FaPlus className="mr-2"/> Add Photo
                    </button>
                )}
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Description */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p>{team.description || 'No description available.'}</p>
            </div>

            {/* Work Hours */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Work Hours</h2>
                <p>{team.workHours || 'Work hours not set.'}</p>
            </div>

            {/* Work Days */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Work Days</h2>
                <div className="flex flex-wrap space-x-2 mt-2">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day}
                            type="button"
                            className={`px-4 py-2 border rounded-md text-sm ${
                                selectedDays && selectedDays.includes(day)
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-600 border-gray-300'
                            }`}
                            onClick={() => handleDayClick(day)}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Members */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Members</h2>
                <ul className="space-y-4">
                    {team.members && team.members.length > 0 ? (
                        team.members.map((member, index) => (
                            <li key={index} className="p-4 border border-gray-200 rounded-md">
                                <p className="font-semibold">{member.fio}</p>
                                <p>{member.email}</p>
                                {isOwner && (
                                    <button
                                        className="mt-2 text-red-500 hover:underline"
                                        // Add logic to remove member
                                    >
                                        Remove
                                    </button>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No members available.</p>
                    )}
                </ul>
                {isOwner && (
                    <button
                        className="mt-4 flex items-center text-blue-500 hover:underline"
                        onClick={() => setIsInviteMemberModalOpen(true)}
                    >
                        <FaPlus className="mr-2"/> Invite Member
                    </button>
                )}
            </div>

            {isOwner && (
                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                        // Add logic to delete team
                    >
                        Delete Team
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => setIsEditTeamModalOpen(true)}
                    >
                        Edit Team
                    </button>
                </div>
            )}

            {/* Edit Team Modal */}
            <Modal
                isOpen={isEditTeamModalOpen}
                onClose={() => setIsEditTeamModalOpen(false)}
                title="Edit Team Information"
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={newTeamData.name}
                        onChange={(e) => setNewTeamData({...newTeamData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Work Hours"
                        value={newTeamData.workHours}
                        onChange={(e) => setNewTeamData({...newTeamData, workHours: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <textarea
                        placeholder="Description"
                        value={newTeamData.description}
                        onChange={(e) => setNewTeamData({...newTeamData, description: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Days Off</label>
                        <div className="flex flex-wrap space-x-2 mt-2">
                            {daysOfWeek.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    className={`px-4 py-2 border rounded-md text-sm ${
                                        newTeamData.daysOff.includes(day)
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-600 border-gray-300'
                                    }`}
                                    onClick={() => {
                                        setNewTeamData(prev => ({
                                            ...prev,
                                            daysOff: prev.daysOff.includes(day)
                                                ? prev.daysOff.filter(d => d !== day)
                                                : [...prev.daysOff, day]
                                        }));
                                    }}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleSaveTeamChanges}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Save Changes
                    </button>
                </div>
            </Modal>

            {/* Invite Member Modal */}
            <Modal
                isOpen={isInviteMemberModalOpen}
                onClose={() => setIsInviteMemberModalOpen(false)}
                title="Invite Member"
            >
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={emailToInvite}
                        onChange={(e) => setEmailToInvite(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <button
                        onClick={handleInviteMember}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Invite
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default TeamPage;
