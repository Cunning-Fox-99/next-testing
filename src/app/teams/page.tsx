'use client';
import React, { useState } from 'react';
import Link from "next/link";
import { ITeam } from "@/types/team.type"; // Тип команды

export default function TeamSearch() {
    const [query, setQuery] = useState('');
    const [filteredTeams, setFilteredTeams] = useState<ITeam[]>([]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        try {
            const response = await fetch(`/api/teams/search?query=${e.target.value}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredTeams(data);
            }
        } catch (error) {
            console.error('Ошибка поиска команд:', error);
        }
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Search Teams</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Find teams by name or description.
                    </p>
                </div>

                {/* Поисковая строка */}
                <div className="mt-10 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search by team name..."
                        value={query}
                        onChange={handleSearch}
                        className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Результаты поиска */}
                <div
                    className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {filteredTeams.length === 0 && (
                        <div className="text-left text-gray-500">
                            <span className="text-lg">No teams found</span>
                        </div>
                    )}
                    {filteredTeams.map((team) => (
                        <article key={team._id}
                                 className="flex max-w-xl flex-col items-center justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex-shrink-0">
                                <img
                                    alt={team.name}
                                    src={team.portfolio?.[0] || '/default-team-image.png'}
                                    className="h-24 w-24 rounded-full bg-gray-50 object-cover shadow-sm ring-2 ring-indigo-500"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <Link href={`/teams/${team._id}`}
                                      className="block text-2xl font-semibold leading-7 text-gray-900 hover:text-indigo-600">
                                    {team.name}
                                </Link>
                                <p className="mt-2 text-sm text-gray-500">{team.description}</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {team.workHours ? `Work Hours: ${team.workHours}` : 'No work hours specified'}
                                </p>
                            </div>
                            <div className="mt-4">
                                <Link href={`/teams/${team._id}`}
                                      className="text-indigo-600 text-sm font-semibold hover:underline">
                                    View Team &rarr;
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
