'use client';
import React, { useEffect, useState } from 'react';
import { IProject } from "@/types/project.type";
import Link from "next/link";
import moment from 'moment';

const ProjectView = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [project, setProject] = useState<IProject | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', about: '', contact: '' });
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/view`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setProject(data.project);

                if (data.user) {
                    setIsUserAuthenticated(true);
                    setFormData({ name: data.user.username, about: '', contact: data.user?.phone || data.user?.email || '' });
                }
            } else {
                console.error('Failed to fetch project');
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleApply = async () => {
        try {
            console.log(formData)
            const response = await fetch(`/api/projects/${id}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Application submitted successfully!');
                setModalOpen(false);
            } else {
                alert('Failed to submit application.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg">
            {project ? (
                <>
                    {/* Project Info */}
                    <div className="border-b border-gray-300 pb-6">
                        <h1 className="text-4xl font-bold text-indigo-700">{project.title}</h1>
                        <p className="mt-4 text-gray-700">{project.description}</p>
                        <p className="mt-2 text-gray-500">Event Date: {moment(project.eventDate).format('MMMM Do, YYYY')}</p>
                        <p className="mt-2 text-gray-500">Status: <span className={`font-semibold ${project.status === 'ongoing' ? 'text-green-600' : 'text-red-600'}`}>{project.status}</span></p>
                        <div className="mt-4">
                            {project.tags.map((tag) => (
                                <span key={tag} className="bg-indigo-100 text-indigo-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Team</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {project.team.map((member) => (
                                <div key={member._id} className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-gray-800">{member.username}</h3>
                                    <p className="text-gray-500">Profession: {member.profession}</p>
                                    <p className="text-gray-500">Work Hours: {member.workHours}</p>
                                    <p className="mt-2 text-sm text-gray-600">{member.about}</p>
                                    <p className="mt-2 text-sm text-gray-600">Phone: {member.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="mt-8">
                        {isUserAuthenticated ? (
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition-colors"
                            >
                                Apply to Join
                            </button>
                        ) : (
                            <Link href="/login">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                                    Login to Apply
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Apply Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 shadow-lg">
                                <h3 className="text-xl font-semibold text-gray-800">Apply to Join the Project</h3>
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="border rounded-md py-2 px-4 w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <textarea
                                        name="about"
                                        placeholder="About Yourself"
                                        value={formData.about}
                                        onChange={handleInputChange}
                                        className="border rounded-md py-2 px-4 w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        name="contact"
                                        placeholder="Contact Details"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        className="border rounded-md py-2 px-4 w-full"
                                    />
                                </div>
                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={handleApply}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading project details...</p>
            )}
        </div>
    );
};

export default ProjectView;
