'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import GalleryComponent from "@/components/GalleryComponent";
import {UserType} from "@/types/user.type"; // Предполагается, что используется NextAuth для аутентификации

const ProfilePage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const { register, handleSubmit, setValue } = useForm<UserType>();
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // Состояние для выбранных выходных дней

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/me');
        const data = await response.json();
        setUser(data);

        // Заполнение значений формы
        setValue('username', data.username);
        setValue('about', data.about);
        setValue('workHours', data.workHours);
        setValue('profession', data.profession);
        setValue('phone', data.phone);
        setSelectedDays(data.daysOff || []);
        console.log(data)
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    fetchUserProfile();
  }, [router, setValue]);

  const handleDayClick = (day: string) => {
    setSelectedDays((prevDays) =>
        prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
    );
  };

  const onSubmit = async (data: UserType) => {

    try {
      const response = await fetch('/api/me/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, daysOff: selectedDays }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  if (!user) return <p>Loading...</p>;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>

        <div className="flex items-center space-x-4 mb-6">
          {user.profileImage && (
              <Image
                  src={user.profileImage}
                  alt="Profile Image"
                  width={80}
                  height={80}
                  className="rounded-full"
              />
          )}
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
                id="username"
                placeholder="John Doe"
                {...register('username')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
                id="phone"
                placeholder="Phone number"
                {...register('phone')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
            <input
                id="profession"
                {...register('profession')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>


          <div>
            <label htmlFor="workHours" className="block text-sm font-medium text-gray-700">Work Hours</label>
            <input
                id="workHours"
                placeholder="10:00 - 22:00"
                {...register('workHours')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Work Days</label>
            <div className="flex space-x-2 mt-2">
              {daysOfWeek.map(day => (
                  <button
                      key={day}
                      type="button"
                      className={`px-4 py-2 border rounded-md text-sm ${
                          selectedDays.includes(day)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-600 border-gray-300'
                      }`}
                      onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">About me</label>
            <textarea
                id="about"
                {...register('about')}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Gallery</h3>
          <GalleryComponent images={user?.images || []}/>
        </div>
      </div>
  );
};

export default ProfilePage;
