'use client';
import React, { useEffect, useState } from 'react';
import { UserType } from "@/types/user.type";

const Page = ({ params }: { params: { id: string } }) => {

    const [user, setUser] = useState<UserType | null>(null);

    const getUser = async () => {
        try {
            const response = await fetch('/api/public/get-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: params.id }),
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user');
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return <div className="container p-6 lg:px-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-6 flex items-center justify-center">
                    <img
                        src={user.profileImage || '/default-avatar.png'}
                        alt={user.username || 'User'}
                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                    />
                </div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">{user.username || 'Username'}</h1>
                    <p className="mt-2 text-sm text-gray-600">{user.profession || 'Profession not provided'}</p>

                    {user.about && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold text-gray-800">About</h2>
                            <p className="mt-2 text-gray-600">{user.about}</p>
                        </div>
                    )}

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                        <p className="mt-2 text-gray-600">
                            <strong>Email:</strong> {user.email || 'Not provided'}
                        </p>
                        {user.phone && (
                            <p className="mt-1 text-gray-600">
                                <strong>Phone:</strong> {user.phone}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-800">Work Details</h2>
                        {user.workHours && (
                            <p className="mt-2 text-gray-600">
                                <strong>Work Hours:</strong> {user.workHours}
                            </p>
                        )}
                        {user.daysOff && user.daysOff.length > 0 && (
                            <p className="mt-1 text-gray-600">
                                <strong>Days Off:</strong> {user.daysOff.join(', ')}
                            </p>
                        )}
                    </div>

                    {user.images && user.images.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-800">Gallery</h2>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {user.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`User image ${index + 1}`}
                                        className="h-40 w-full object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
