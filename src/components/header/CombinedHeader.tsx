'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DashboardHeader from './DashboardHeader';
import Header from './Header';
import { Poppins } from 'next/font/google';
import store from '@/store/store';
import { Provider, useDispatch } from 'react-redux';
import { UserType } from '@/types/user.type';
import { setUser } from '@/store/slices/userSlice';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
});

const CombinedHeaderContent = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();

    const getUser = async () => {
        try {
            const response = await fetch('/api/me');
            if (response.ok) {
                const userData: UserType = await response.json();
                dispatch(setUser(userData)); // Сохраняем пользователя в Redux
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <header className={poppins.className}>
            {pathname.includes('/dashboard') ? <DashboardHeader /> : <Header />}
        </header>
    );
};

const CombinedHeader = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <Provider store={store}>
            <CombinedHeaderContent />
            {children}
        </Provider>
    );
};

export default CombinedHeader;
