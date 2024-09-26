'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IProjectOptional, ProjectStatus, ParticipantStatus, ParticipationRequest } from "@/types/project.type";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {FiUpload} from "react-icons/fi";
import { FiTrash } from "react-icons/fi";

const ProjectPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [project, setProject] = useState<IProjectOptional | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<ProjectStatus | null>(null);
    const [participantStatus, setParticipantStatus] = useState<ParticipantStatus | null>(null);
    const [inviteeEmail, setInviteeEmail] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);

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

    const inviteMembers = async () => {
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

    const removeParticipant = async (participantId: string) => {
        try {
            const response = await fetch(`/api/projects/${params.id}/participants/${participantId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove participant');
            }
            alert('Participant removed successfully');
            fetchProject(); // Обновление проекта после удаления участника
        } catch (err: any) {
            setError(err.message);
        }
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const imgBBResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB}`, {
            method: 'POST',
            body: formData,
        });

        if (!imgBBResponse.ok) {
            throw new Error(`Error uploading to ImgBB: ${imgBBResponse.statusText}`);
        }

        const imgBBData = await imgBBResponse.json();
        return imgBBData.data.url; // Возвращаем URL загруженного изображения
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;
        try {
            const imageUrl = await uploadImage(imageFile);
            // Сохраните URL в базе данных
            await saveImageUrl(imageUrl); // Реализуйте эту функцию в вашем API
            alert('Image uploaded successfully');
            setImageFile(null); // Сбрасываем состояние
            fetchProject()
        } catch (error:any) {
            setError(error.message);
        }
    };

    const saveImageUrl = async (imageUrl: string) => {
        // Реализуйте сохранение URL в вашем API
        const response = await fetch(`/api/projects/${params.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
            throw new Error('Failed to save image URL');
        }
    };

    const deleteImage = async (imageUrl: string) => {
        const response = await fetch(`/api/projects/${params.id}/images`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete image');
        }

        alert('Image deleted successfully');
        fetchProject(); // Обновляем проект после удаления изображения
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

            {/* Загрузка изображения */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upload Image</h3>
                <div className="flex items-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2">
                        <FiUpload className="w-6 h-6 text-blue-500"/>
                        <span className="text-gray-600">Choose an image</span>
                    </label>
                    {imageFile && (
                        <span className="ml-auto text-gray-700">{imageFile.name}</span>
                    )}
                </div>
                <button
                    onClick={handleImageUpload}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Upload
                </button>
            </div>

            {project.images && <Swiper className="bg-white p-4 rounded-lg shadow-md" spaceBetween={10} slidesPerView={3}>
                {project.images.map((imageUrl) => (
                    <SwiperSlide key={imageUrl}>
                        <img src={imageUrl} alt="Project Image" className="w-full h-auto rounded-lg" />
                        <button
                            onClick={() => deleteImage(imageUrl)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                        >
                            <FiTrash />
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>}

            {/* Team Slider */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Team Members</h3>
                {project.team?.length ? (
                    <Swiper spaceBetween={10} slidesPerView={3} navigation pagination={{clickable: true}}>
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

            {/* Invite Members */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700">Invite Members</h3>
                <input
                    type="email"
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                    placeholder="Enter email to invite"
                    className="p-2 border rounded w-full"
                />
                <button
                    onClick={inviteMembers}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Send Invite
                </button>
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
                                <button
                                    onClick={() => removeParticipant(participant._id)}
                                    className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>
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
