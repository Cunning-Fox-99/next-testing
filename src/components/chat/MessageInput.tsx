'use client';

import { useState } from 'react';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import useImageUploader from '@/hooks/useImageUploader'; // Подключаем хук для загрузки изображений

interface MessageInputProps {
    activeChat: any;
    currentUserId: string;
    onSendMessage: (message: string, images: string[]) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
                                                       activeChat,
                                                       currentUserId,
                                                       onSendMessage,
                                                   }) => {
    const [newMessage, setNewMessage] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const { uploadImage, uploading } = useImageUploader();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            const previewUrls = files.map(file => URL.createObjectURL(file));

            // Обновляем состояние с выбранными изображениями
            setSelectedImages((prevImages) => [...prevImages, ...files]);
            setImagePreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
        }
    };

    const handleImageRemove = (index: number) => {
        // Удаляем изображение по индексу
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const handleSendMessage = async () => {
        let uploadedImageUrls: string[] = [];

        // Загружаем изображения и получаем их URL
        for (const image of selectedImages) {
            const imageUrl = await uploadImage(image);
            if (imageUrl) {
                uploadedImageUrls.push(imageUrl);
            }
        }

        // Отправляем сообщение и изображения, если они есть
        if ((newMessage || uploadedImageUrls.length > 0) && currentUserId) {
            onSendMessage(newMessage, uploadedImageUrls);
            setNewMessage('');
            setSelectedImages([]);
            setImagePreviews([]);
        }
    };

    return (
        <div className="border-t-2 border-gray-300 p-4 flex flex-col justify-between fixed bottom-0 w-2/3 bg-white">
            {imagePreviews.length > 0 && (
                <div className="flex space-x-2 mb-2">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                            <img src={preview} alt="Selected preview" className="h-20 w-20 object-cover rounded-md" />
                            <button
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                                <AiOutlineClose size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center w-full">
                <textarea
                    className="flex-grow p-2 border rounded-md focus:outline-none resize-none"
                    placeholder="Введите ваше сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <input type="file" onChange={handleImageUpload} className="hidden" id="image-upload" multiple />
                <label htmlFor="image-upload" className="ml-2 cursor-pointer">
                    <AiOutlinePlus />
                </label>

                <button
                    onClick={handleSendMessage}
                    className="ml-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={uploading}
                >
                    {uploading ? 'Загрузка...' : 'Отправить'}
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
