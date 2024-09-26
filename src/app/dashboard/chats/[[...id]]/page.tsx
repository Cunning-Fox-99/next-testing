'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {AiOutlinePlus} from 'react-icons/ai';
import {ChatI} from "@/types/chat.type";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import chat from "@/models/Chat";

const ChatsDetailPage = ({params}: { params: { id: string } }) => {
    const router = useRouter();

    const {id} = params;
    const [chatList, setChatList] = useState<ChatI[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(id || null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const user = useSelector((state: RootState) => state.user.user)

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
            console.log(data)
            setChatList(data.chats);

            // if (!activeChatId && data.chats.length > 0) {
            //     setActiveChatId(data.chats[0]._id);
            //     router.push(`/dashboard/chats/${data.chats[0]._id}`);
            // }
        } catch (error) {
            console.error('Error fetching chats:', error);
            setErrorMessage('Failed to load chats');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            console.log(user)
            setCurrentUserId(user._id)
            fetchChats();
        }

    }, [activeChatId, router, user]);

    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId);
        router.push(`/dashboard/chats/${chatId}`);
    };

    const handleSendMessage = async () => {
        console.log(newMessage)
        console.log(currentUserId)
        if (newMessage && currentUserId) {
            try {
                const res = await fetch(`/api/chat/${activeChatId}/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({message: newMessage}),
                });

                console.log(res)

                if (!res.ok) {
                    throw new Error('Failed to send message');
                }

                const data = await res.json();
                // Обновить список чатов с новым сообщением
                setChatList((prevChats) =>
                    prevChats.map((chat) =>
                        chat._id === activeChatId ? data.chat : chat
                    )
                );
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
                setErrorMessage('Failed to send message');
            }
        }
    };

    useEffect(() => {
        if (id) {
            handleChatSelect(id[0])
        }
    }, [id])

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
                            <div className="text-sm font-medium">
                                {chat.chatWith.username || chat.chatWith.email}
                            </div>
                            <div className="text-xs text-gray-500">{chat.participants[0].email}</div>
                            {/* Отображаем количество непрочитанных сообщений */}
                            {chat.notReadedMessages && chat.notReadedMessages[currentUserId!] > 0 && (
                                <span className="text-xs text-red-500">
                                    {chat.notReadedMessages[currentUserId!]} unread messages
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Окно активного чата справа */}
            <div className="flex flex-col w-2/3">
                <div className="flex-grow overflow-y-auto p-4 space-y-2" style={{maxHeight: 'calc(100vh - 80px)'}}>
                    {!activeChat ? (
                        <div className="text-center text-gray-500">Chat not selected</div>
                    ) : (
                        activeChat.messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-md ${msg.sender === currentUserId ? 'bg-green-100' : 'bg-blue-100'}`}
                            >
                                <div className="text-xs text-gray-500">
                                    {msg.sender === currentUserId ? 'You' : activeChat.chatWith?.username || activeChat.chatWith.email}
                                </div>
                                {msg.type === 'image' ? (
                                    <img src={msg.content} alt="Message Image" className="max-w-full h-auto"/>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Зона ввода сообщений */}
                {activeChat && (
                    <div
                        className="border-t-2 border-gray-300 p-4 flex items-center justify-between fixed bottom-0 w-2/3 bg-white">
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
