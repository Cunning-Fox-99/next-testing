'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { UserType } from '@/types/user.type';

interface Notification {
    id: string;
    text: string;
}

const DashboardHeader = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [active, setActive] = useState(false);
    const [user, setUser] = useState<UserType | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const getUser = () => {
        fetch('/api/me').then(r => r.json()).then(r => setUser(r));
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
    };

    const handleNotificationsClick = () => {
        setShowNotifications(prev => !prev);
    };

    const fetchNotifications = async () => {
        // Replace this URL with your actual API endpoint for notifications
        const response = await fetch('/api/notifications');
        if (response.ok) {
            const data: Notification[] = await response.json();
            setNotifications(data);
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
                                <span className="absolute -inset-0.5"></span>
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
                                <svg
                                    className="hidden h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <Image
                                    width={50}
                                    height={50}
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/Image/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Link
                                        href="/dashboard"
                                        className={`rounded-md ${pathname === '/dashboard' ? 'bg-gray-900' : null} px-3 py-2 text-sm font-medium text-white`}
                                        aria-current="page"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/dashboard/team"
                                        className={`rounded-md ${pathname === '/dashboard/team' ? 'bg-gray-900' : null} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white`}
                                    >
                                        Team
                                    </Link>
                                    <Link
                                        href="/dashboard/project"
                                        className={`rounded-md ${pathname === '/dashboard/project' ? 'bg-gray-900' : null} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white`}
                                    >
                                        Projects
                                    </Link>
                                    <Link
                                        href="/dashboard/orders"
                                        className={`rounded-md ${pathname === '/dashboard/orders' ? 'bg-gray-900' : null} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white`}
                                    >
                                        Orders
                                    </Link>
                                    <Link
                                        href="/dashboard/chats"
                                        className={`rounded-md ${pathname === '/dashboard/chats' ? 'bg-gray-900' : null} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white`}
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
                                <span className="absolute -inset-1.5"></span>
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
                                <div className="absolute right-1.5 top-1/2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical">
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <div key={notification.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                {notification.text}
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
                                {user && (
                                    <div>
                                        <button
                                            type="button"
                                            className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            id="user-menu-button"
                                            aria-expanded="false"
                                            aria-haspopup="true"
                                        >
                                            <span className="absolute -inset-1.5"></span>
                                            <span className="sr-only">Open user menu</span>
                                            <Image
                                                width={50}
                                                height={50}
                                                className="h-8 w-8 rounded-full"
                                                src={user?.profileImage ? user.profileImage : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} alt="" /> </button> </div> )}
                                {active && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                        <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" id="user-menu-item-0">Your Profile</Link>
                                        <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" id="user-menu-item-1">Settings</Link>
                                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" id="user-menu-item-2">Sign out</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu, show/hide based on menu state */}
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link href="/dashboard" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</Link>
                        <Link href="/dashboard/team" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</Link>
                        <Link href="/dashboard/project" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</Link>
                        <Link href="/dashboard/calendar" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</Link>
                        <Link href="/dashboard/orders" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Orders</Link>
                    </div>
                </div>
            </nav>
        </>
    ); };

export default DashboardHeader;
