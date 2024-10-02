'use client';

import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import useImageUploader from '@/hooks/useImageUploader'; // Подключаем наш хук

interface ImageUploaderProps {
  images: string[];
}

const GalleryComponent: React.FC<ImageUploaderProps> = ({ images }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(images || []);

  // Используем хук для загрузки изображений
  const { uploadImage, uploading, error } = useImageUploader();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const uploadedImageUrl = await uploadImage(file); // Загружаем файл через хук

      if (uploadedImageUrl) {
        setUploadedImages((prevImages) => [...prevImages, uploadedImageUrl]); // Обновляем состояние с новыми изображениями
      }
    });

    await Promise.all(uploadPromises);
    setSelectedFiles([]); // Очищаем файлы после загрузки
  };

  const handleDelete = async (imageUrl: string) => {
    try {
      const deleteResponse = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!deleteResponse.ok) {
        throw new Error(`Ошибка удаления изображения: ${deleteResponse.statusText}`);
      }

      // Удаляем изображение из состояния после успешного удаления
      setUploadedImages((prevImages) => prevImages.filter((url) => url !== imageUrl));
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedImage = e.dataTransfer.getData('text/plain');
    const newImages = [...uploadedImages];
    const dragIndex = newImages.indexOf(draggedImage);

    // Удаляем перемещённое изображение
    newImages.splice(dragIndex, 1);

    // Вставляем изображение на новое место
    newImages.splice(index, 0, draggedImage);

    setUploadedImages(newImages);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, imageUrl: string) => {
    e.dataTransfer.setData('text/plain', imageUrl);
  };

  useEffect(() => {
    setUploadedImages(images);
  }, [images]);

  return (
      <div>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>

        {error && <div className="text-red-500">{error}</div>}

        <div className="gallery">
          {uploadedImages.map((src, index) => (
              <div
                  key={src}
                  className="relative"
                  draggable
                  onDragStart={(e) => handleDragStart(e, src)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
              >
                <img src={src} alt={`Uploaded ${index}`} className="uploaded-image" />
                <button
                    onClick={() => handleDelete(src)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTrash />
                </button>
              </div>
          ))}
        </div>
      </div>
  );
};

export default GalleryComponent;
