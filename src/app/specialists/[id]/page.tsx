'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserType } from "@/types/user.type"; // Предполагается, что UserType определяет структуру пользователя
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Page = ({ params }: { params: { id: string } }) => {
    const [isLoading, setIsLoading] = useState(true); // Для индикации загрузки данных пользователя
    const [user, setUser] = useState<UserType | null>(null); // Состояние для хранения данных пользователя
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.user.user);


    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/public/get-user/${params.id}`);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData); // Устанавливаем данные пользователя в состояние
            } else {
                console.error('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setIsLoading(false); // Завершаем индикатор загрузки
        }
    };

    useEffect(() => {


        fetchUser();
    }, [params.id]); // Запускаем эффект при изменении params.id

    const createChat = async () => {
        // Предполагается, что пользователь должен быть авторизован для создания чата


        if (!currentUser) {
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

    if (isLoading) {
        return <div className="container p-6 lg:px-8">Loading...</div>;
    }

    if (!user) {
        return <div className="container p-6 lg:px-8">User not found</div>;
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
