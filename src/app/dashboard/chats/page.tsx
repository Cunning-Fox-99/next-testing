'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai'; // React Icon for plus/gallery

interface Chat {
    id: number;
    user: {
        name: string;
        email: string;
    };
    messages: string[];
}

const ChatPage = () => {
    // Dummy data for chat list
    const chatList: Chat[] = [
        { id: 1, user: { name: 'Alice', email: 'alice@example.com' }, messages: ['Hello from Alice'] },
        { id: 2, user: { name: 'Bob', email: 'bob@example.com' }, messages: ['Hey there!'] },
        { id: 3, user: { name: 'Charlie', email: 'charlie@example.com' }, messages: ['Hi!'] },
    ];

    const [activeChatId, setActiveChatId] = useState<number>(chatList[0].id);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    // Get the active chat messages based on selected chat
    const activeChat = chatList.find((chat) => chat.id === activeChatId);

    const handleSendMessage = () => {
        if (newMessage.trim() || selectedImage) {
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

    return (
        <div className="flex h-screen">
            {/* Chat list on the left */}
            <div className="w-1/3 border-r-2 border-gray-300 p-4">
                <h2 className="text-lg font-semibold mb-4">Chats</h2>
                <div className="space-y-2">
                    {chatList.map((chat) => (
                        <div
                            key={chat.id}
                            className={`p-2 rounded-md cursor-pointer ${activeChatId === chat.id ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-blue-50`}
                            onClick={() => setActiveChatId(chat.id)}
                        >
                            {/* Display user name if available, otherwise email */}
                            <div className="text-sm font-medium">
                                {chat.user.name || chat.user.email}
                            </div>
                            <div className="text-xs text-gray-500">{chat.user.email}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active chat window on the right */}
            <div className="flex flex-col w-2/3">
                <div className="flex-grow overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                    {activeChat?.messages.map((msg, idx) => (
                        <div key={idx} className="bg-blue-100 p-2 rounded-md">
                            {msg}
                        </div>
                    ))}
                </div>

                {/* Input area fixed at the bottom */}
                <div className="border-t-2 border-gray-300 p-4 flex items-center justify-between fixed bottom-0 w-2/3 bg-white">
                    {/* Image input */}
                    <label className="relative flex items-center cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <AiOutlinePlus className="text-2xl text-gray-500 mr-4 cursor-pointer" />
                    </label>

                    {/* Message input */}
                    <input
                        type="text"
                        className="flex-grow p-2 border rounded-md focus:outline-none"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />

                    {/* Send button */}
                    <button
                        onClick={handleSendMessage}
                        className="ml-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
