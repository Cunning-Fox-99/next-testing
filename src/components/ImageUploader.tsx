'use client';

import React, { useEffect, useState } from 'react';

interface ImageUploaderProps {
  images: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(images || []);
  
  // Helper function to generate a random filename
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
        console.log(process.env.NEXT_PUBLIC_IMGBB)
        // Upload image to ImgBB
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

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    setSelectedFiles([]);
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
          <img key={index} src={src} alt={`Uploaded ${index}`} className="uploaded-image" />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
