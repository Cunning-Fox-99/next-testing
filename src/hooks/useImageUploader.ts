import { useState } from 'react';

const useImageUploader = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Функция для генерации уникального имени файла
    const generateRandomFilename = (originalFilename: string) => {
        const randomSuffix = Math.random().toString(36).substr(2, 8); // Генерация случайного суффикса
        const fileExtension = originalFilename.split('.').pop(); // Получаем расширение файла
        return `${Date.now()}_${randomSuffix}.${fileExtension}`; // Возвращаем новое уникальное имя
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        const randomFilename = generateRandomFilename(file.name);
        formData.append('image', file, randomFilename); // Используем сгенерированное имя

        setUploading(true);
        setError(null);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить изображение');
            }

            const data = await response.json();
            const uploadedImageUrl = data.data.url;
            setImageUrl(uploadedImageUrl);

            return uploadedImageUrl; // Возвращаем URL загруженного изображения
        } catch (err) {
            console.error('Ошибка при загрузке изображения:', err);
            setError('Ошибка при загрузке изображения');
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, imageUrl, uploading, error };
};

export default useImageUploader;
