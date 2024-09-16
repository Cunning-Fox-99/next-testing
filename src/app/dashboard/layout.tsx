// app/dashboard/layout.tsx
import React from 'react';
import DashboardHeader from './DashboardHeader'; // Импортируем ваш компонент хедера

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className='w-full'>
      <DashboardHeader /> {/* Хедер, который будет виден на всех страницах внутри /dashboard */}
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
