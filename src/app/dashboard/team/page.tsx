'use client'

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Modal from '@/components/Modal';

const TeamsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [myTeams, setMyTeams] = useState<{ _id: string; name: string }[]>([]);
    const [invitations, setInvitations] = useState<{ _id: string; teamId: { _id: string; name: string } }[]>([]);
    const [searchResults, setSearchResults] = useState<{ _id: string; name: string }[]>([]);
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');
    const router = useRouter();

    const fetchTeamsAndInvitations = async () => {
        try {
            const response = await fetch('/api/teams/my-teams');
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setMyTeams(data.teams);
                setInvitations(data.invitations);
            }
        } catch (error) {
            console.error('Ошибка при получении команд и приглашений:', error);
        }
    };

    useEffect(() => {
        // Получение команд и приглашений при загрузке компонента
        fetchTeamsAndInvitations();
    }, []);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        try {
            const response = await fetch(`/api/teams/search?query=${e.target.value}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Ошибка поиска команд:', error);
        }
    };

    const handleTeamClick = (teamId: string) => {
        router.push(`/dashboard/team/${teamId}`);
    };

    const handleCreateTeam = async () => {
        try {
            const response = await fetch('/api/teams/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: teamName, description: teamDescription}),
            });
            if (!response.ok) throw new Error('Не удалось создать команду');

            const createdTeam = await response.json();
            console.log(createdTeam)
            router.push(`/dashboard/team/${createdTeam.team._id}`);
        } catch (error) {
            console.error('Ошибка при создании команды:', error);
        } finally {
            setIsCreateTeamModalOpen(false);
        }
    };

    const handleInviteResponse = async (inviteId: string, response: 'accept' | 'decline') => {
        try {
            const apiResponse = await fetch(`/api/invitations/${inviteId}/${response}`, {
                method: 'POST'
            });
            if (apiResponse.ok) {
                // Удаляем приглашение из локального состояния
                setInvitations((prevInvitations) =>
                    prevInvitations.filter(invite => invite._id !== inviteId)
                );
            }
        } catch (error) {
            console.error('Ошибка при обработке ответа на приглашение:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Teams</h1>

            {/* Кнопка создания команды */}
            <button
                onClick={() => setIsCreateTeamModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md mb-6"
            >
                Create new team
            </button>

            {/* Поисковая строка */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Find team"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>

            {/* Мои команды */}
            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">My teams</h2>
                {myTeams.length > 0 ? (
                    <ul className="space-y-4">
                        {myTeams.map((team) => (
                            <li
                                key={team._id}
                                className="p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:bg-blue-100 hover:border-blue-500"
                                onClick={() => handleTeamClick(team._id)}
                            >
                                {team.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">
                        Yoy haven't team yet.{' '}
                        <span
                            className="text-blue-500 underline cursor-pointer"
                            onClick={() => setIsCreateTeamModalOpen(true)}
                        >
                            Create team
                        </span>.
                    </p>
                )}
            </div>

            {/* Приглашения */}
            {invitations.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">My invites</h2>
                    <ul className="space-y-4">
                        {invitations.map((invite) => (
                            <li key={invite._id} className="p-4 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center">
                                    <span>{invite.teamId?.name}</span>
                                    <div>
                                        <button
                                            onClick={() => handleInviteResponse(invite._id, 'accept')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleInviteResponse(invite._id, 'decline')}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Результаты поиска */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Search result</h2>
                {searchResults.length > 0 ? (
                    <ul className="space-y-4">
                        {searchResults.map((team) => (
                            <li
                                key={team._id}
                                className="p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:bg-blue-100 hover:border-blue-500"
                                onClick={() => handleTeamClick(team._id)}
                            >
                                {team.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">Teams not found.</p>
                )}
            </div>

            {/* Модальное окно создания команды */}
            <Modal
                isOpen={isCreateTeamModalOpen}
                onClose={() => setIsCreateTeamModalOpen(false)}
                title="Создать новую команду"
            >

                <div className="space-y-4"><input type="text" placeholder="Название команды" value={teamName}
                                                  onChange={(e) => setTeamName(e.target.value)}
                                                  className="w-full p-3 border border-gray-300 rounded-md"/> <textarea
                    placeholder="Описание команды" value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"/>
                    <button onClick={handleCreateTeam} className="px-4 py-2 bg-blue-500 text-white rounded-md"> Создать
                        команду
                    </button>
                </div>
            </Modal></div>);
};
export default TeamsPage;