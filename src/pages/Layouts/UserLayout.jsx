import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { Outlet } from 'react-router-dom'
import LoginRegisterCard from '../LoginRegisterCard'

const UserLayout = () => {
    const [showLoginCard, setShowLoginCard] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar with role and sidebar toggle props */}
            <Navbar 
                role="user" 
                onAuthClick={() => setShowLoginCard(true)}
                onSidebarToggle={toggleSidebar}
            />

            {/* Sidebar - Let it handle its own positioning and responsiveness */}
            <Sidebar 
                role="user"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Auth Modal */}
            {showLoginCard && (
                <LoginRegisterCard onClose={() => setShowLoginCard(false)} />
            )}

            {/* Main Content Area - Responsive margin for desktop sidebar */}
            <div className="transition-all duration-300 lg:ml-64">
                <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8 min-h-[calc(100vh-5rem)]">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default UserLayout