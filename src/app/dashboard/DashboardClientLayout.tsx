// DashboardClientLayout.tsx
'use client'; // Указываем, что это клиентский компонент
import React from "react";
import { Provider } from "react-redux";
import store from "@/store/store";

const DashboardClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default DashboardClientLayout;
