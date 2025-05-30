import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import LoginRegisterCard from '../LoginRegisterCard'

const LibrarianLayout = () => {
    const [showLoginCard, setShowLoginCard] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <Navbar onAuthClick={() => setShowLoginCard(true)} />

            {/* Auth Modal */}
            {showLoginCard && (
                <LoginRegisterCard onClose={() => setShowLoginCard(false)} />
            )}

            {/* Main Layout Container */}
            <div className="flex">
                {/* Sidebar */}
                <Sidebar role="librarian" />

                {/* Main Content Area */}
                {/* In UserLayout.jsx */}
                <div className="flex-1 transition-all duration-300 pl-0 lg:pl-64">                    {/* Content with proper spacing */}
                    <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8 min-h-[calc(100vh-4rem)]">
                        <div className="max-w-7xl mx-auto">

                            <Outlet />
                        </div>
                    </main>


                </div>
            </div>
        </div>
    )
}

export default LibrarianLayout;