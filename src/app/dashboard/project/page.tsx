'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Project {
	id: string;
	title: string;
	status: 'ongoing' | 'completed';
}

const ProjectsPage = () => {
	const router = useRouter();
	const ongoingProjects: Project[] = [
		{ id: '1', title: 'Project A', status: 'ongoing' },
		{ id: '2', title: 'Project B', status: 'ongoing' },
	];
	const completedProjects: Project[] = [
		{ id: '3', title: 'Project C', status: 'completed' },
	];

	const handleProjectClick = (id: string) => {
		router.push(`/dashboard/project/${id}`);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-semibold mb-6">Projects</h1>

			{/* Ongoing Projects */}
			<div>
				<h2 className="text-lg font-medium mb-4">Ongoing Projects</h2>
				{ongoingProjects.length > 0 ? (
					<ul className="space-y-4">
						{ongoingProjects.map((project) => (
							<li
								key={project.id}
								className="p-4 border rounded-md hover:bg-gray-100 cursor-pointer"
								onClick={() => handleProjectClick(project.id)}
							>
								{project.title}
							</li>
						))}
					</ul>
				) : (
					<p>No ongoing projects</p>
				)}
			</div>

			{/* Completed Projects */}
			<div className="mt-8">
				<h2 className="text-lg font-medium mb-4">Completed Projects</h2>
				{completedProjects.length > 0 ? (
					<ul className="space-y-4">
						{completedProjects.map((project) => (
							<li
								key={project.id}
								className="p-4 border rounded-md hover:bg-gray-100 cursor-pointer"
								onClick={() => handleProjectClick(project.id)}
							>
								{project.title}
							</li>
						))}
					</ul>
				) : (
					<p>No completed projects</p>
				)}
			</div>
		</div>
	);
};

export default ProjectsPage;
