'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IProjectOptional } from "@/types/project.type";

const ProjectPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [project, setProject] = useState<IProjectOptional | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }
            const data = await response.json();
            setProject(data);
            console.log(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!project) {
        return <div>No project found.</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{project.title}</h1>

            {/* Project Details */}
            <div className="space-y-4">
                <p><strong>Participants:</strong> {project.team!.length || 0} people</p>
                <p>
                    <strong>Date:</strong> {project.eventDate ? new Date(project.eventDate).toLocaleDateString() : 'N/A'}
                </p>
                <p>
                    <strong>Time:</strong> {project.eventDate ? new Date(project.eventDate).toLocaleTimeString() : 'N/A'}
                </p>
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
