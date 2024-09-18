'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserType } from "@/types/user.type";

const Page = ({ params }: { params: { id: string } }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Для индикации загрузки чата

    const router = useRouter();

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/check-token', {
                method: 'POST',
            });
            const data = await res.json();
            setIsAuthenticated(data.isValid);
        } catch (err) {
            console.error('Error checking token', err);
        }
    };

    const getUser = async () => {
        try {
            const response = await fetch('/api/public/get-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: params.id }),
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const createChat = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/chat/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: params.id, // ID пользователя, которому мы хотим написать
                }),
            });

            if (response.ok) {
                const chatData = await response.json();
                console.log('Chat created successfully', chatData);
                router.push(`/dashboard/chats`);
            } else {
                throw new Error('Failed to create chat');
            }
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    };


    useEffect(() => {
        getUser().then(() => checkAuth());
    }, []);

    if (!user) {
        return <div className="container p-6 lg:px-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-6 flex items-center justify-center">
                    <img
                        src={user.profileImage || '/default-avatar.png'}
                        alt={user.username || 'User'}
                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                    />
                </div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">{user.username || 'Username'}</h1>
                    <p className="mt-2 text-sm text-gray-600">{user.profession || 'Profession not provided'}</p>

                    {user.about && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold text-gray-800">About</h2>
                            <p className="mt-2 text-gray-600">{user.about}</p>
                        </div>
                    )}

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                        <p className="mt-2 text-gray-600">
                            <strong>Email:</strong> {user.email || 'Not provided'}
                        </p>
                        {user.phone && (
                            <p className="mt-1 text-gray-600">
                                <strong>Phone:</strong> {user.phone}
                            </p>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={createChat}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Chat...' : 'Start Chat'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
