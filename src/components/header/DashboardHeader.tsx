'use client';
import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {UserType} from '@/types/user.type';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {INotification, NotificationType} from "@/types/notification.type";
import {FaTimes} from 'react-icons/fa'; // Import Close icon

const DashboardHeader = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const [active, setActive] = useState(false);
    const [localUser, setLocalUser] = useState<UserType | null>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        setLocalUser(user);
    }, [user]);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
    };

    const handleNotificationsClick = () => {
        setShowNotifications(prev => !prev);
    };

    const fetchNotifications = async () => {
        const response = await fetch('/api/notifications');
        if (response.ok) {
            const data: { notifications: INotification[] } = await response.json();
            console.log(data)
            setNotifications(data.notifications);
        }
    };

    const removeNotification = async (id: string) => {
        setShowNotifications(false)
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH'
            });

            if (response.ok) {
                console.log('Notification marked as read');
                setNotifications(notifications.filter(notification => notification._id !== id));
            } else {
                console.error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        // Optionally, send a request to server to mark notification as removed
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getNotificationLink = (notification: INotification) => {
        // Generate link based on the type of notification
        switch (notification.type) {
            case NotificationType.PROJECT_APPLICATION:
                return `/dashboard/project/${notification.project}`;
            case NotificationType.TEAM_INVITATION:
                return `/dashboard/team`;
            default:
                return '#';
        }
    };

    return (
        <>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className="block h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <Link href='/' className="flex flex-shrink-0 items-center">
                                <Image
                                    width={50}
                                    height={50}
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/Image/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                />
                            </Link>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Link
                                        href="/dashboard"
                                        className={`rounded-md ${pathname === '/dashboard' ? 'bg-gray-900' : ''} px-3 py-2 text-sm font-medium text-white`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/dashboard/team"
                                        className={`rounded-md ${pathname.includes('team') ? 'bg-gray-900' : ''} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white`}
                                    >
                                        Team
                                    </Link>
                                    <Link
                                        href="/dashboard/project"
                                        className={`rounded-md ${pathname.includes('project') ? 'bg-gray-900' : ''} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white`}
                                    >
                                        Projects
                                    </Link>
                                    <Link
                                        href="/dashboard/chats"
                                        className={`rounded-md ${pathname.includes('chats') ? 'bg-gray-900' : ''} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white`}
                                    >
                                        Chats
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* Notifications button */}
                            <button
                                type="button"
                                onClick={handleNotificationsClick}
                                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                <span className="sr-only">View notifications</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </button>

                            {/* Notifications dropdown */}
                            {showNotifications && (
                                <div className="absolute right-1.5 top-1/2 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <div key={notification._id} className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <Link href={getNotificationLink(notification)} onClick={() => removeNotification(notification._id)} className="text-blue-500">
                                                    {notification.message}
                                                </Link>
                                                <button onClick={() => removeNotification(notification._id)}>
                                                    <FaTimes className="text-red-500 hover:text-red-700" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-700">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Profile dropdown */}
                            <div onClick={() => setActive(prevState => !prevState)} className="relative ml-3">
                                {localUser && (
                                    <div>
                                        <button
                                            type="button"
                                            className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            <Image
                                                width={50}
                                                height={50}
                                                className="h-8 w-8 rounded-full"
                                                src={localUser?.profileImage ? localUser.profileImage : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                alt="User avatar"
                                            />
                                        </button>
                                    </div>
                                )}
                                {active && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Your Profile
                                        </Link>
                                        <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Settings
                                        </Link>
                                        <div
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Sign out
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default DashboardHeader;
