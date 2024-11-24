import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '~/context/UserContext';
function AdminLayout() {
    const { logout } = useContext(UserContext);
    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {/* <header>
                Header admin
                <button onClick={handleLogout}>Logout</button>
            </header> */}
            <main>
                <Outlet />
            </main>
            {/* <footer>Footer admin</footer> */}
        </>
    );
}

export default AdminLayout;
