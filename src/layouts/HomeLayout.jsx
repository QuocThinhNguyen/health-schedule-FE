import { Outlet } from 'react-router-dom';
import ChatBotAIButton from '~/components/Chat/ChatBotAIButton';
import ChatButton from '~/components/Chat/ChatButton';
import Footer from '~/components/Footer';
import Header from '~/components/Header';

function HomeLayout() {
    return (
        <>
            <Header />
            <main className="min-h-screen-minus-20 mt-14 relative">
                <Outlet />
                <ChatButton />
                <ChatBotAIButton />
            </main>
            <Footer />
        </>
    );
}

export default HomeLayout;
