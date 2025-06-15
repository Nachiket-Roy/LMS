import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, user, authInitialized } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (!authInitialized) return;

        if (isAuthenticated && user) {
            const role = user.role;
            if (role === 'user') navigate('/user', { replace: true });
            else if (role === 'librarian') navigate('/librarian', { replace: true });
            else if (role === 'admin') navigate('/admin', { replace: true });
        }
    }, [authInitialized, isAuthenticated, user, navigate]);

    return children;
};

export default PublicOnlyRoute;
