'use client';
import React, { useState } from 'react';
import Link from "next/link";
import { IProjectOptional } from "@/types/project.type";

export default function ProjectSearch() {
    const [query, setQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState<IProjectOptional[]>([]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        try {
            const response = await fetch(`/api/public/search-project?query=${e.target.value}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredProjects(data);
            }
        } catch (error) {
            console.error('Ошибка поиска проектов:', error);
        }
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Search Projects</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Find projects by their title or tags.
                    </p>
                </div>

                {/* Поисковая строка */}
                <div className="mt-10 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search by title or tags..."
                        value={query}
                        onChange={(e) => handleSearch(e)}
                        className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Результаты поиска */}
                <div
                    className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {filteredProjects.length === 0 && (
                        <div className="text-left text-gray-500">
                            <span className="text-lg">No projects found</span>
                        </div>
                    )}
                    {filteredProjects.map((project) => (
                        <article key={project._id}
                                 className="flex cursor-pointer max-w-xl flex-col items-center justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="mt-4 text-center">
                                <Link href={`/projects/${project._id}`}
                                      className="block text-2xl font-semibold leading-7 text-gray-900 hover:text-indigo-600">
                                    {project.title}
                                </Link>
                                <p className="mt-2 text-sm text-gray-500">{project.description?.substring(0, 100)}...</p>
                                <p className="mt-1 text-sm text-gray-400">{project.tags?.join(', ')}</p>
                            </div>
                            <div className="mt-4">
                                <Link href={`/projects/${project._id}`}
                                      className="text-indigo-600 text-sm font-semibold hover:underline">
                                    View Project &rarr;
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
