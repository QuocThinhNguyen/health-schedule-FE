import { Outlet } from 'react-router-dom';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import UserDashboard from '~/pages/User/UserDashboard';

function UserLayout() {
    return (
        <>
            <Header />
            <main>
                <UserDashboard />
            </main>
            <Footer />
        </>
    );
}

export default UserLayout;
