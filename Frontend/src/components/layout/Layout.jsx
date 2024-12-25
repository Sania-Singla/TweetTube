import React from 'react';
import { Header, SideBar } from '../index';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div className="h-[calc(100vh-80px)]">
            <Header />
            <SideBar />
            <div className="bg-[#0c0c0c] text-white mt-[80px] p-4 pb-[75px] sm:pb-4 sm:ml-14 lg:ml-[250px] min-h-full">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
