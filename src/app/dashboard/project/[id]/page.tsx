'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IProjectOptional, ProjectStatus, ParticipantStatus, ParticipationRequest } from "@/types/project.type";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProjectPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [project, setProject] = useState<IProjectOptional | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<ProjectStatus | null>(null);
    const [participantStatus, setParticipantStatus] = useState<ParticipantStatus | null>(null);
    const [inviteeEmail, setInviteeEmail] = useState<string>('');

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }
            const data = await response.json();
            console.log(data);
            setProject(data);
            setParticipantStatus(data.participantStatus);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProjectStatus = async (status: ProjectStatus) => {
        try {
            const response = await fetch(`/api/projects/${params.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            setNewStatus(status);
            fetchProject();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateParticipantStatus = async (status: ParticipantStatus) => {
        try {
            const response = await fetch(`/api/projects/${params.id}/participant-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantStatus: status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update participant status');
            }
            setParticipantStatus(status);
            fetchProject();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleParticipationRequest = async (requestId: string, newStatus: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`/api/projects/${params.id}/requests/${requestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error('Failed to update request');
            }
            fetchProject();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const inviteParticipant = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteeEmail }),
            });
            if (!response.ok) {
                throw new Error('Failed to send invitation');
            }
            setInviteeEmail('');
            alert('Invitation sent successfully');
        } catch (err: any) {
            setError(err.message);
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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">{project.title}</h1>

            {/* Project Owner */}
            <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md">
                <img
                    src={project.owner?.profileImage || '/default-avatar.png'}
                    alt="Owner Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">{project.owner?.username}</h2>
                    <p className="text-gray-500">{project.owner?.profession}</p>
                </div>
            </div>

            {/* Project Status */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800">Project Status</h2>
                <p className="text-gray-600">Current Status: {project.status}</p>
                <select
                    value={newStatus || project.status}
                    onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                    className="p-2 border rounded"
                >
                    {Object.values(ProjectStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => newStatus && updateProjectStatus(newStatus)}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Update Status
                </button>
            </div>

            {/* Participant Status */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800">Participant Status</h2>
                <p className="text-gray-600">Current Participant Status: {project.participantStatus}</p>
                <select
                    value={participantStatus || project.participantStatus}
                    onChange={(e) => setParticipantStatus(e.target.value as ParticipantStatus)}
                    className="p-2 border rounded"
                >
                    {Object.values(ParticipantStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => participantStatus && updateParticipantStatus(participantStatus)}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Update Participant Status
                </button>
            </div>

            {/* Project Description */}
            <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800">Description</h2>
                <p className="text-gray-600">{project.description}</p>
            </div>

            {/* Team Slider */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Team Members</h3>
                {project.team?.length ? (
                    <Swiper spaceBetween={10} slidesPerView={3} navigation pagination={{ clickable: true }}>
                        {project.team.map((member, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                                    <img
                                        src={member.profileImage || '/default-avatar.png'}
                                        alt="Team Member"
                                        className="w-12 h-12 rounded-full object-cover mx-auto"
                                    />
                                    <p className="mt-2 text-gray-700">{member.username}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-gray-500">No team members yet.</p>
                )}
            </div>

            {/* Participation Requests */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700">Participation Requests</h3>
                {project.participationRequests?.length ? (
                    <ul className="space-y-4">
                        {project.participationRequests.map((request: ParticipationRequest, idx) => (
                            <li key={idx} className="p-4 border rounded-lg">
                                <p><strong>User:</strong> {request.user.username}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                                <p><strong>Submitted At:</strong> {new Date(request.submittedAt).toLocaleString()}</p>
                                <div className="mt-2 space-x-2">
                                    <button
                                        onClick={() => handleParticipationRequest(request._id, 'approved')}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleParticipationRequest(request._id, 'rejected')}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No participation requests yet.</p>
                )}
            </div>

            {/* Invite Participant */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700">Invite Participants</h3>
                <input
                    type="email"
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                    placeholder="Enter email to invite"
                    className="p-2 border rounded w-full"
                />
                <button
                    onClick={inviteParticipant}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Send Invite
                </button>
            </div>

            {/* Participants Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700">Participants</h3>
                {project.participants?.length ? (
                    <ul className="space-y-4">
                        {project.participants.map((participant, idx) => (
                            <li key={idx} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <img
                                    src={participant.profileImage || '/default-avatar.png'}
                                    alt={participant.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-700">{participant.username}</p>
                                    <p className="text-gray-500">{participant.profession}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No participants yet.</p>
                )}
            </div>

            {/* Go Back Button */}
            <button
                onClick={() => router.push('/dashboard/projects')}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Back to Projects
            </button>
        </div>
    );
};

export default ProjectPage;
