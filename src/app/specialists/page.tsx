'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import {UserType} from "@/types/user.type";


export default function UserSearch() {
    const [query, setQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        try {
            const response = await fetch(`/api/public/search-user?query=${e.target.value}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredUsers(data);
            }
        } catch (error) {
            console.error('Ошибка поиска команд:', error);
        }
    };

    //
    // useEffect(() => {
    //
    // }, [query]);

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Search Users</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Find the right users by their name or role.
                    </p>
                </div>

                {/* Поисковая строка */}
                <div className="mt-10 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={query}
                        onChange={(e) => handleSearch(e)}
                        className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Результаты поиска */}
                <div
                    className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {filteredUsers.length === 0 && (
                        <div className="text-left text-gray-500">
                            <span className="text-lg">No users found</span>
                        </div>
                    )}
                    {filteredUsers.map((user) => (
                        <article key={user._id}
                                 className="flex max-w-xl flex-col items-center justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex-shrink-0">
                                <img
                                    alt={user.username}
                                    src={user.profileImage}
                                    className="h-24 w-24 rounded-full bg-gray-50 object-cover shadow-sm ring-2 ring-indigo-500"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <Link href={`/user/${user._id}`}
                                      className="block text-2xl font-semibold leading-7 text-gray-900 hover:text-indigo-600">
                                    {user.username}
                                </Link>
                                <p className="mt-2 text-sm text-gray-500">{user.profession}</p>
                                <p className="mt-1 text-sm text-gray-400">{user.email}</p>
                            </div>
                            <div className="mt-4">
                                <Link href={`/user/${user._id}`}
                                      className="text-indigo-600 text-sm font-semibold hover:underline">
                                    View Profile &rarr;
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
