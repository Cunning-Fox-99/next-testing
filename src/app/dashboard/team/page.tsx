// pages/teams.tsx
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Используем useRouter для навигации

const TeamsPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [myTeams, setMyTeams] = useState<{ id: string; name: string }[]>([
		{ id: '1', name: 'Team Alpha' },
		{ id: '2', name: 'Team Beta' }
	]); // Примерные данные команд пользователя
	const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([
		{ id: '3', name: 'Team Gamma' },
		{ id: '4', name: 'Team Delta' }
	]); // Примерные результаты поиска

	const router = useRouter();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		// Логика для поиска команд по запросу
		// setSearchResults(результаты поиска);
	};

	const handleTeamClick = (teamId: string) => {
		router.push(`/dashboard/team/${teamId}`);
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Teams</h1>

			{/* Search Bar */}
			<div className="mb-8">
				<input
					type="text"
					placeholder="Search teams to join"
					value={searchQuery}
					onChange={handleSearch}
					className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				/>
			</div>

			{/* My Teams */}
			<div className="mb-12">
				<h2 className="text-xl font-semibold mb-4">My Teams</h2>
				{myTeams.length > 0 ? (
					<ul className="space-y-4">
						{myTeams.map((team) => (
							<li
								key={team.id}
								className="p-4 border border-gray-200 rounded-md cursor-pointer"
								onClick={() => handleTeamClick(team.id)}
							>
								{team.name}
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-600">
						You have no teams yet. <a href="/create-team" className="text-blue-500 underline">Create a team</a>.
					</p>
				)}
			</div>

			{/* Search Results */}
			<div>
				<h2 className="text-xl font-semibold mb-4">Search Results</h2>
				{searchResults.length > 0 ? (
					<ul className="space-y-4">
						{searchResults.map((team) => (
							<li
								key={team.id}
								className="p-4 border border-gray-200 rounded-md cursor-pointer"
								onClick={() => handleTeamClick(team.id)}
							>
								{team.name}
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-600">No teams found.</p>
				)}
			</div>
		</div>
	);
};

export default TeamsPage;
