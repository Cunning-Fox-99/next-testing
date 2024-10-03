'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChatI } from "@/types/chat.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChatWindow from '@/components/chat/ChatWindow'; // Подключаем компонент ChatWindow

const ChatsDetailPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { id } = params;

    const [chatList, setChatList] = useState<ChatI[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(id || null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const user = useSelector((state: RootState) => state.user.user);


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
            setChatList(data.chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            setErrorMessage('Failed to load chats');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            setCurrentUserId(user._id);
        }
    }, [user]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchChats(); // обновляем список чатов
        }, 5000); // например, каждые 5 секунд
        fetchChats();
        return () => clearInterval(intervalId); // очищаем интервал при размонтировании
    }, []);

    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId);
        router.push(`/dashboard/chats/${chatId}`);
    };

    const handleSendMessage = async (message: string, images: string[]) => {
        if (!currentUserId) return;

        try {
            const res = await fetch(`/api/chat/${activeChatId}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, images }),
            });

            if (!res.ok) {
                throw new Error('Failed to send message');
            }

            const data = await res.json();
            setChatList((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === activeChatId ? data.chat : chat
                )
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setErrorMessage('Failed to send message');
        }
    };

    useEffect(() => {
        if (id) {
            handleChatSelect(id[0]);
        }
    }, [id]);

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
                            className={`flex items-center p-2 rounded-md cursor-pointer ${activeChatId === chat._id ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-blue-50`}
                            onClick={() => handleChatSelect(chat._id)}
                        >
                            <Image width={50} height={50} src={chat.chatWith?.profileImage || '/default-image.jpg'} className="rounded-full mr-3" alt={'Profile image'} />
                            <div className="flex flex-col">
                                <div className="text-sm font-medium">
                                    {chat.chatWith.username || chat.chatWith.email}
                                </div>
                                <div className="text-s text-gray-500">{chat.messages.at(-1)?.content || chat.messages.at(-1)?.images ? 'Image' : ''}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Окно активного чата справа */}
            <div className="w-2/3">
                {activeChat && currentUserId ? (
                    <ChatWindow
                        activeChat={activeChat}
                        currentUserId={currentUserId}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="text-center text-gray-500">Please select a chat to view messages.</div>
                )}
            </div>
        </div>
    );
};

export default ChatsDetailPage;
