import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import MainLayout from './pages/Layouts/MainLayout';
import UserLayout from './pages/Layouts/UserLayout';
import LibrarianLayout from './pages/Layouts/LibrarianLayout';
import AdminLayout from './pages/Layouts/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Collection from './pages/Collection';
import UserDashboard from './pages/UserDashBoard/UserDashboard';
import Browse from './pages/UserDashBoard/Browse';
import FinesPaymentsPage from './pages/UserDashBoard/Fines';
import SettingsPage from './pages/UserDashBoard/Setting';
import MyBooksPage from './pages/UserDashBoard/MyBook';
import LibrarianDashboard from './pages/Librarian/Librarian';
import ReportsPage from './pages/Librarian/Report';
import AdminDashboard from './pages/Admin/Admin';
import UserManagement from './pages/Admin/UserManagement';
import Query from './pages/UserDashBoard/Query';
import LibrarianSettingsPage from './pages/Librarian/Setting';
import QueryManagement from './pages/Librarian/QueryManagement';
import BookManagementPage from './pages/Librarian/BookManagement';
import BorrowNotificationPage from './pages/Librarian/BorrowNotificationPage';
import PublicOnlyRoute from './components/PublicOnlyRoutes';
import AdminQueryManagement from './pages/Admin/QueryManagement';
import AdminSettingsPage from './pages/Admin/Setting';
import AdminFinesPayments from './pages/Admin/Fines&Payments';
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <PublicOnlyRoute><Home /></PublicOnlyRoute> },
      { path: '/about', element: <PublicOnlyRoute><About /></PublicOnlyRoute> },
      { path: '/contact', element: <PublicOnlyRoute><Contact /></PublicOnlyRoute> },
      { path: '/faqs', element: <PublicOnlyRoute><FAQs /></PublicOnlyRoute> },
      { path: '/collection', element: <PublicOnlyRoute><Collection /></PublicOnlyRoute> },
    ]
  },
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: 'user',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        )
      },
      { path: 'user/browse', element: <Browse /> },
      { path: 'user/fine', element: <FinesPaymentsPage /> },
      { path: 'user/query', element: <Query /> },
      { path: 'user/setting', element: <SettingsPage /> },
      { path: 'user/mybooks', element: <MyBooksPage /> }
    ]
  },
  {
    path: '/',
    element: <LibrarianLayout />,
    children: [
      {
        path: 'librarian',
        element: (
          <ProtectedRoute allowedRoles={['librarian']}>
            <LibrarianDashboard />
          </ProtectedRoute>
        )
      },
      { path: 'librarian/manage', element: <BookManagementPage /> },
      { path: 'librarian/requests', element: <BorrowNotificationPage /> },
      { path: 'librarian/query', element: < QueryManagement /> },
      { path: 'librarian/reports', element: <ReportsPage /> },
      { path: 'librarian/setting', element: <LibrarianSettingsPage /> }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      { path: 'user', element: <UserManagement /> },
      { path: 'query', element: <AdminQueryManagement /> },
      { path: 'setting', element: <AdminSettingsPage /> },
      { path: 'fine', element: <AdminFinesPayments /> }


    ]
  }
]);

export default router;
