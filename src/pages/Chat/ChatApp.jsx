import { useContext, useEffect, useState } from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatMain from './components/ChatMain';
import { FiMenu } from 'react-icons/fi';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';

export default function ChatApp() {
    const { user } = useContext(UserContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    useEffect(() => {
        if (!user?.userId) {
            toast.error('Bạn cần đăng nhập để sử dụng tính năng này!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    }, [user]);

    return (
        <div className="flex h-full bg-[var(--bg-primary)]">
            <button className="md:hidden fixed top-4 left-4 z-5 p-2 rounded-full shadow-md" onClick={toggleSidebar}>
                <FiMenu className="text-gray-700" size={20} />
            </button>

            <div
                className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 transition-transform duration-300 ease-in-out 
                w-[344px] h-full shadow-md z-40 fixed md:relative`}
            >
                <ChatSidebar activeChat={activeChat} setActiveChat={setActiveChat} />
            </div>

            <div className="flex-1 max-w-screen-chat flex flex-col">
                <ChatMain activeChat={activeChat ? activeChat : null} />
            </div>

            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleSidebar}></div>
            )}
        </div>
    );
}
