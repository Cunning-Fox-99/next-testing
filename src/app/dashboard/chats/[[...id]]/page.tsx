'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlinePlus } from 'react-icons/ai';
import { ChatI } from "@/types/chat.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useImageUploader from '@/hooks/useImageUploader'; // Подключаем хук для загрузки изображений
import Image from 'next/image';

const ChatsDetailPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { id } = params;

    const [chatList, setChatList] = useState<ChatI[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(id || null);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Для хранения выбранного изображения
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const { uploadImage, uploading, error } = useImageUploader(); // Используем хук для загрузки изображения

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
            fetchChats();
        }
    }, [user]);

    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId);
        router.push(`/dashboard/chats/${chatId}`);
    };

    const handleSendMessage = async () => {
        let messageContent = newMessage;
        let messageType = 'text';

        if (selectedImage) {
            // Загружаем изображение
            const uploadedImageUrl = await uploadImage(selectedImage);
            if (uploadedImageUrl) {
                messageContent = uploadedImageUrl; // Если изображение успешно загружено, сообщение — это ссылка на изображение
                messageType = 'image';
            }
        }

        if (messageContent && currentUserId) {
            try {
                const res = await fetch(`/api/chat/${activeChatId}/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: messageContent, type: messageType }),
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

                setNewMessage('');
                setSelectedImage(null); // Очищаем выбранное изображение после отправки
            } catch (error) {
                console.error('Error sending message:', error);
                setErrorMessage('Failed to send message');
            }
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedImage(event.target.files[0]);
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
                                <div className="text-s text-gray-500">{chat.messages.at(-1)?.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Окно активного чата справа */}
            <div className="flex flex-col w-2/3">
                <div className="flex-grow overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                    {!activeChat ? (
                        <div className="text-center text-gray-500">Chat not selected</div>
                    ) : (
                        activeChat.messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex w-fit flex-col p-2 rounded-md ${msg.sender === currentUserId ? 'bg-green-100 items-end ml-auto' : 'bg-blue-100'}`}
                            >
                                <div className="text-xs text-gray-500">
                                    {msg.sender === currentUserId ? 'You' : activeChat.chatWith?.username || activeChat.chatWith.email}
                                </div>
                                {msg.type === 'image' ? (
                                    <img src={msg.content} alt="Message Image" className="max-w-full h-auto" />
                                ) : (
                                    msg.content
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Зона ввода сообщений */}
                {activeChat && (
                    <div className="border-t-2 border-gray-300 p-4 flex items-center justify-between fixed bottom-0 w-2/3 bg-white">
                       <div className="flex flex-col w-full">
                        <textarea
                            className="flex-grow p-2 border rounded-md focus:outline-none"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                       </div>

                        <input type="file" onChange={handleImageUpload} className="hidden" id="image-upload" />
                        <label htmlFor="image-upload" className="ml-2 cursor-pointer">
                            <AiOutlinePlus />
                        </label>

                        <button
                            onClick={handleSendMessage}
                            className="ml-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Send'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatsDetailPage;
