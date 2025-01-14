import { Outlet } from 'react-router-dom';
import Footer from '~/components/Footer';
import Header from '~/components/Header';

function HomeLayout() {
    return (
        <>
            <Header />
            <main className="min-h-screen-minus-20 mt-10">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default HomeLayout;
