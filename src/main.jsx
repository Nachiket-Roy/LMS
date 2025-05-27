import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import MainLayout from './pages/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs'
import FAQs from './pages/FAQs'
import Collection from './pages/Collection'
import Policies from './pages/Policies';
import UserDashboard from './pages/UserDashBoard/UserPage';
import LibrarianDashboard from './pages/Librarian/Librarian';
import AdminDashboard from './pages/Admin/Admin';
// Layout and pages


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <ContactUs /> },
      { path: '/faqs', element: <FAQs /> },
      { path: '/collection', element: <Collection /> },
      { path: '/policies', element: <Policies/>},
      {path: '/user', element: <UserDashboard/> },
      {path: '/librarian', element: <LibrarianDashboard/> },
      {path: '/admin', element: < AdminDashboard />}
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);