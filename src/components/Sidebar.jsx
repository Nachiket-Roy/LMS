import { useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaSearch, FaHistory, FaDollarSign, FaFlag, FaUsers, FaCog } from 'react-icons/fa';

const Sidebar = () => {
    const adminMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome },
        { id: 'users', label: 'Manage Users', icon: FaUsers },
        { id: 'settings', label: 'Settings', icon: FaCog },

    ];

    const userMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome },
        { id: 'books', label: 'My Books', icon: FaBookOpen },
        { id: 'search', label: 'Search Books', icon: FaSearch },
        { id: 'history', label: 'History', icon: FaHistory },
        { id: 'fines', label: 'Fines', icon: FaDollarSign },
        { id: 'issues', label: 'Report Issue', icon: FaFlag },
    ];

    const librarianMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome },
        { id: 'books', label: 'My Books', icon: FaBookOpen },
        { id: 'search', label: 'Search Books', icon: FaSearch },
        { id: 'history', label: 'History', icon: FaHistory },
        { id: 'fines', label: 'Fines', icon: FaDollarSign },
        { id: 'issues', label: 'Report Issue', icon: FaFlag },
    ];


    const location = useLocation();
    const pathname = location.pathname;

    let role;
    if (pathname.startsWith('/admin')) {
        role = 'admin';
    } else if (pathname.startsWith('/user')) {
        role = 'user';
    } else if (pathname.startsWith('/librarian')) {
        role = 'librarian';
        return (
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full pt-20 lg:pt-6">
                    <nav className="flex-1 px-4 space-y-2">
                        {userMenuItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${activeTab === item.id
                                        ? 'bg-purple-100 text-purple-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </button>
                            );
                        })}
                        {adminMenuItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${activeTab === item.id
                                        ? 'bg-purple-100 text-purple-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </button>
                            );
                        })}
                        {librarianMenuItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${activeTab === item.id
                                        ? 'bg-purple-100 text-purple-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        )
    }
}
export default Sidebar;