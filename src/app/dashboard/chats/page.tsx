'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChatI } from "@/types/chat.type";

const ChatsPage = () => {
    const router = useRouter();
    const  id  = null;
    const [chatList, setChatList] = useState<ChatI[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchChats = async () => {
        try {
            const res = await fetch('/api/chat/get-chats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch chats');
            }

            const data = await res.json();

            if (data.chats.length === 0) {
                setErrorMessage('No chats available');
            } else {
                setChatList(data.chats);
                if (!activeChatId && data.chats.length > 0) {
                    setActiveChatId(data.chats[0]._id);
                    router.push(`/dashboard/chats/${data.chats[0]._id}`);
                }
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
            setErrorMessage('Failed to load chats');
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId);
        router.push(`/dashboard/chats/${chatId}`);
    };

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    const activeChat = chatList.find((chat) => chat._id === activeChatId);

    return (
        <div className="flex h-screen">
            {/* Список чатов слева */}
            <div className="w-1/3 border-r-2 border-gray-300 p-4">
                <h2 className="text-lg font-semibold mb-4">Chats</h2>
                <div className="space-y-2">
                    {chatList.map((chat) => (
                        <div
                            key={chat._id}
                            className={`p-2 rounded-md cursor-pointer ${activeChatId === chat._id ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-blue-50`}
                            onClick={() => handleChatSelect(chat._id)}
                        >
                            {/* Отображение имени пользователя или email */}
                            <div className="text-sm font-medium">
                                {chat.participants[0].username || chat.participants[0].email}
                            </div>
                            <div className="text-xs text-gray-500">{chat.participants[0].email}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Окно активного чата справа */}
            <div className="flex-grow p-4 flex items-center justify-center">
                {!activeChat ? (
                    <div className="text-center text-gray-500">Chat not selected</div>
                ) : (
                    <div className="text-center">No messages here</div>
                )}
            </div>
        </div>
    );
};

export default ChatsPage;
