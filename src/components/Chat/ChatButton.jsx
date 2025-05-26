import { useContext, useState } from 'react';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { useSocket } from '~/pages/Chat/useSocket';

function ChatButton() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const socket = useSocket(user?.userId);
    const isOnChatPage =
        location.pathname === '/chat' || location.pathname === '/chatbot' || location.pathname === '/video';
    const handleClick = async () => {
        if (user?.auth === true) {
            try {
                const formData = new FormData();
                formData.append('userId', user?.userId);
                formData.append('partnerId', 1);
                const response = await axiosInstance.post('/chat-room', formData);
                if (response.status === 200) {
                    socket.emit('join_room', response.data.chatRoomId);
                } else {
                    console.error('Failed to create room:', response.message);
                }
            } catch (error) {
                console.error('Error creating room:', error);
            }
            navigate('/chat');
        } else {
            setShowModal(true);
        }
    };
    return (
        <>
            {!isOnChatPage && (
                <div className="fixed top-[calc(100vh-130px)] right-3 z-40">
                    <button
                        onClick={handleClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]  text-[var(--bg-active)] shadow-lg transition-all duration-300 group"
                        aria-label="Chat với Admin"
                    >
                        <RiCustomerService2Fill className="text-2xl" />
                        <span className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></span>

                        <div
                            className={`absolute bottom-full right-0 mb-2 whitespace-nowrap bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md text-sm font-medium transition-all duration-200 ${
                                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                            }`}
                        >
                            Chat với Admin
                            <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-white transform rotate-45"></div>
                        </div>
                    </button>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in-up">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <img src="/account.png" alt="login" className="w-8 h-8" />

                                <h3 className="ml-3 text-lg font-medium text-gray-900">Yêu cầu đăng nhập</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-600">
                                Bạn cần đăng nhập để sử dụng chức năng Chat với Admin. Vui lòng đăng nhập để tiếp tục.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                            <div
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium cursor-pointer"
                                onClick={() => {
                                    setShowModal(false);
                                    navigate('/login');
                                }}
                            >
                                Đăng nhập ngay
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatButton;
