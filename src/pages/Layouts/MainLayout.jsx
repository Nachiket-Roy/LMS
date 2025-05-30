import React from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'
import { useState } from 'react'
import LoginRegisterCard from '../LoginRegisterCard'

const MainLayout = () => {
      const [showLoginCard, setShowLoginCard] = useState(false);

  return (
    <>
    <Navbar onAuthClick={() => setShowLoginCard(true)} />
      {showLoginCard && (
        <LoginRegisterCard onClose={() => setShowLoginCard(false)} />
      )}
    <main> <Outlet/> </main>
    <Footer />
    </>
  )
}

export default MainLayout
