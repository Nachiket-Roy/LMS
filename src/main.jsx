import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import MainLayout from './pages/Layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact'
import FAQs from './pages/FAQs'
import Collection from './pages/Collection'
import UserPage from './pages/UserDashBoard/UserPage'
import UserLayout from './pages/Layouts/UserLayout';
import Browse from './pages/UserDashBoard/Browse';
import ReadingHistoryPage from './pages/UserDashBoard/ReadingHistory';
import FinesPaymentsPage from './pages/UserDashBoard/Fines';
import SettingsPage from './pages/UserDashBoard/Setting';
import MyBooksPage from './pages/UserDashBoard/MyBook';
import LibrarianDashboard from './pages/Librarian/Librarian';
import LibrarianLayout from './pages/Layouts/LibrarianLayout';
import AddBookPage from './pages/Librarian/AddBook';
import IssueBookPage from './pages/Librarian/IssuedBooks';
import ReportsPage from './pages/Librarian/Report';
import LibraryRequestPage from './pages/Librarian/Requests';
import UserLibraryDashboard from './pages/Librarian/Users';
import AdminLayout from './pages/Layouts/AdminLayout';
import AdminDashboard from './pages/Admin/Admin';
import UserManagement from './pages/Admin/UserManagement';
import LibrarianManagement from './pages/Admin/LibrarianManagement';
// Layout and pages


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/faqs', element: <FAQs /> },
      { path: '/collection', element: <Collection /> },
    ],
  },
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { path: 'user', element: <UserPage /> },
      { path: 'user/browse', element: <Browse /> },
      { path: 'user/history', element: <ReadingHistoryPage /> },
      { path: 'user/fine', element: <FinesPaymentsPage /> },
      { path: 'user/setting', element: <SettingsPage /> },
      { path: 'user/mybooks', element: <MyBooksPage /> },

    ]
  },
  {
    path: '/',
    element: <LibrarianLayout />,
    children: [
      { path: 'librarian', element: <LibrarianDashboard /> },
      { path: 'librarian/add-book', element: <AddBookPage /> },
      { path: 'librarian/issued-books', element: <IssueBookPage /> },
      { path: 'librarian/requests', element: <LibraryRequestPage /> },
      { path: 'librarian/users', element: <UserLibraryDashboard /> },
      { path: 'librarian/reports', element: <ReportsPage /> },
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'user', element: <UserManagement /> },
      { path: 'librarian', element: <LibrarianManagement /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'add-book', element: <AddBookPage /> },


    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);