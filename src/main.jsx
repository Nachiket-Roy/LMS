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
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);