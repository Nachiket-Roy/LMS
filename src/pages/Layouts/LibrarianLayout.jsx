import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import LoginRegisterCard from '../LoginRegisterCard'

const LibrarianLayout = () => {
    const [showLoginCard, setShowLoginCard] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar
                role="librarian"
                onAuthClick={() => setShowLoginCard(true)}
                onSidebarToggle={toggleSidebar}
            />
            {/* Auth Modal */}
            <Sidebar
                role="librarian"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            {showLoginCard && (
                <LoginRegisterCard onClose={() => setShowLoginCard(false)} />
            )}
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

export default LibrarianLayout;