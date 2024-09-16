'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    title: string;
    participants: number;
    date: string; // Assuming date is in 'YYYY-MM-DD' format
    time: string; // Time as 'HH:mm'
    description: string;
}

const ProjectPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();

    // Replace this mock data with actual project fetching logic
    const project: Project = {
        id: params.id,
        title: 'Project A',
        participants: 5,
        date: '2024-10-10',
        time: '14:00',
        description: 'This project is about building a web platform for photographers.',
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{project.title}</h1>

            {/* Project Details */}
            <div className="space-y-4">
                <p><strong>Participants:</strong> {project.participants} people</p>
                <p><strong>Date:</strong> {new Date(project.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {project.time}</p>
                <p><strong>Description:</strong> {project.description}</p>
            </div>

            {/* Go Back Button */}
            <button
                onClick={() => router.push('/dashboard/projects')}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Back to Projects
            </button>
        </div>
    );
};

export default ProjectPage;
