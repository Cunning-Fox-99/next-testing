'use client';

import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface ImageUploaderProps {
  images: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(images || []);

  const generateRandomFilename = (originalFilename: string) => {
    const randomSuffix = Math.random().toString(36).substr(2, 8);
    return `${Date.now()}_${randomSuffix}_${originalFilename}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      const randomFilename = generateRandomFilename(file.name);
      formData.append('image', file, randomFilename);

      try {
        const imgBBResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB}`, {
          method: 'POST',
          body: formData,
        });

        if (!imgBBResponse.ok) {
          throw new Error(`Error uploading to ImgBB: ${imgBBResponse.statusText}`);
        }

        const imgBBData = await imgBBResponse.json();
        const fileUrl = imgBBData.data.url;

        // Save image URL in the database
        const saveResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: fileUrl }),
        });

        if (!saveResponse.ok) {
          throw new Error(`Error saving URL: ${saveResponse.statusText}`);
        }

        // Update state with the new image URL
        setUploadedImages((prevImages) => [...prevImages, fileUrl]);

      } catch (error) {
        console.error('Error:', error);
      }
    });

    await Promise.all(uploadPromises);
    setSelectedFiles([]);
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
        throw new Error(`Error deleting image: ${deleteResponse.statusText}`);
      }

      // Update state after successful deletion
      setUploadedImages((prevImages) => prevImages.filter((url) => url !== imageUrl));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedImage = e.dataTransfer.getData('text/plain');
    const newImages = [...uploadedImages];
    const dragIndex = newImages.indexOf(draggedImage);

    // Remove the dragged image
    newImages.splice(dragIndex, 1);

    // Insert the dragged image at the drop index
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
        <button onClick={handleUpload}>Загрузить</button>

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

export default ImageUploader;
