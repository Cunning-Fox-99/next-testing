'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropUtils'; // Вспомогательная функция для обрезки
import { useForm, SubmitHandler } from 'react-hook-form';
import { UserType } from '@/types/user.type';

interface EmailFormValues {
	email: string;
  }
  
  interface PasswordFormValues {
	password: string;
  repeatPassword: string
  }

const SettingsPage = () => {
	const { register, handleSubmit } = useForm<EmailFormValues>();
	const { register: registerPassword, handleSubmit: handlePasswordSubmit } = useForm<PasswordFormValues>();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [user, setUser] = useState<UserType | null>(null)

  const onEmailSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    // Обработка изменения email
    console.log('Email data:', data);
    const apiResponse = await fetch('/api/me/change-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: data.email }),
      });
    
      if (!apiResponse.ok) {
      throw new Error(`Error sending URL to API: ${apiResponse.statusText}`);
      }

      console.log('email updated')
    // Здесь вы можете отправить запрос на сервер для изменения email
  };

  const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
    // Обработка изменения пароля
    console.log('Password data:', data);
    if (data.password !== data.repeatPassword) {
      alert('Incorrect password')
      return
    }

    const apiResponse = await fetch('/api/me/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: data.password }),
      });
    
      if (!apiResponse.ok) {
      throw new Error(`Error sending URL to API: ${apiResponse.statusText}`);
      }

      console.log('password updated')
    // Здесь вы можете отправить запрос на сервер для изменения пароля
  };

  const generateRandomFilename = () => {
    const randomSuffix = Math.random().toString(36).substr(2, 8);
    return `${Date.now()}_${randomSuffix}`;
  };

  const uploadImageOnCloud = async (blob: Blob) => {
	const formData = new FormData();
	const randomFilename = generateRandomFilename();
	formData.append('image', blob, randomFilename);
  
	try {
	  console.log(process.env.NEXT_PUBLIC_IMGBB);
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
  
	  const apiResponse = await fetch('/api/me/change-image', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ link: fileUrl }),
	  });
  
	  if (!apiResponse.ok) {
		throw new Error(`Error sending URL to API: ${apiResponse.statusText}`);
	  }
  
	  console.log('Image URL updated successfully');
	} catch (error) {
	  console.error('Error:', error);
	}
  };
  

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCroppedImage = async () => {
	if (imagePreview && croppedAreaPixels) {
	  const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels);
  
	  // Преобразование dataUrl в Blob
	  const blob = await fetch(croppedImage).then(res => res.blob());
  
	  // Обработка сохранения croppedImage
	  console.log('Cropped Image Blob:', blob);
	  uploadImageOnCloud(blob);  // Передаем Blob в uploadImageOnCloud
	}
  };
  
	const getUser = () => {
	  fetch('/api/me').then(r => r.json()).then(r => {
      setUser(r)
    })
	}
  
	useEffect(() => {
	  getUser()
	}, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

  {/* Change Email Form */}
  <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4 mb-8">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            defaultValue={user?.email}
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Email
        </button>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 mb-8">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            id="password"
            type="password"
            {...registerPassword('password', { required: 'Password is required' })}
            className="mt-1 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
           <label htmlFor="password" className="block text-sm font-medium text-gray-700">Repeat New Password</label>
          <input
            id="repeat-password"
            type="password"
            {...registerPassword('repeatPassword', { required: 'Password is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Change Password
        </button>
      </form>

      {/* Upload Profile Image Form */}
      <form className="space-y-4">
        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
          <input
            id="profileImage"
            type="file"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:border file:border-gray-300 file:bg-gray-50 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-gray-100"
          />
        </div>

        {imagePreview && (
          <div className="relative w-24 h-24 mt-4 border border-gray-300">
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={5/5}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { width: '100px', height: '100px' },
                mediaStyle: { objectFit: 'cover' },
              }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSaveCroppedImage}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Image
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
