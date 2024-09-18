'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AiOutlinePlus } from 'react-icons/ai';
import { ChatI } from "@/types/chat.type";

const ChatsDetailPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { id } = params;
    console.log(id)
    const [chatList, setChatList] = useState<ChatI[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(id);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId);
        router.push(`/dashboard/chats/${chatId}`);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() || selectedImage) {
            const activeChat = chatList.find((chat) => chat._id === activeChatId);
            activeChat?.messages.push(newMessage || 'Image');
            setNewMessage('');
            setSelectedImage(null);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setSelectedImage(file);
        }
    };

    if (isLoading) {
        return <div>Loading chats...</div>;
    }

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
            <div className="flex flex-col w-2/3">
                <div className="flex-grow overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                    {!activeChat ? (
                        <div className="text-center text-gray-500">Чат не выбран</div>
                    ) : (
                        activeChat.messages.map((msg, idx) => (
                            <div key={idx} className="bg-blue-100 p-2 rounded-md">
                                {msg}
                            </div>
                        ))
                    )}
                </div>

                {/* Зона ввода сообщений */}
                {activeChat && (
                    <div className="border-t-2 border-gray-300 p-4 flex items-center justify-between fixed bottom-0 w-2/3 bg-white">
                        <label className="relative flex items-center cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <AiOutlinePlus className="text-2xl text-gray-500 mr-4 cursor-pointer" />
                        </label>

                        <input
                            type="text"
                            className="flex-grow p-2 border rounded-md focus:outline-none"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />

                        <button
                            onClick={handleSendMessage}
                            className="ml-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatsDetailPage;
