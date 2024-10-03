'use client';

import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Image from 'next/image';
import MessageInput from './MessageInput'; // Импортируем новый компонент

interface ChatWindowProps {
    activeChat: any;
    currentUserId: string;
    onSendMessage: (message: string, images: string[]) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ activeChat, currentUserId, onSendMessage }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl); // Устанавливаем выбранное изображение для отображения в модальном окне
    };

    const handleCloseModal = () => {
        setSelectedImage(null); // Закрываем модальное окно
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                {!activeChat ? (
                    <div className="text-center text-gray-500">Chat not selected</div>
                ) : (
                    activeChat.messages.map((msg: any, idx: number) => (
                        <div
                            key={idx}
                            className={`flex w-fit flex-col p-2 rounded-md ${msg.sender === currentUserId ? 'bg-green-100 items-end ml-auto' : 'bg-blue-100'}`}
                        >
                            <div className="text-xs text-gray-500">
                                {msg.sender === currentUserId ? 'You' : activeChat.chatWith?.username || activeChat.chatWith.email}
                            </div>
                            {msg.content}
                            {msg.images && msg.images.length > 0 && (
                                <div className="image-container">
                                    {msg.images.map((imageUrl: string, index: number) => (
                                        <div key={index} onClick={() => handleImageClick(imageUrl)} className="cursor-pointer">
                                            <Image src={imageUrl} alt={`Message Image ${index}`} width={100} height={100} className="max-w-full h-auto" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {activeChat && (
                <MessageInput
                    activeChat={activeChat}
                    currentUserId={currentUserId}
                    onSendMessage={onSendMessage}
                />
            )}

            {/* Модальное окно для увеличенного изображения */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-white">
                            <AiOutlineClose size={24} />
                        </button>
                        <Image src={selectedImage} alt="Selected" width={800} height={800} className="max-w-full max-h-screen" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
