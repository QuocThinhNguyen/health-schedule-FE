import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';

function ChatBotAIButton() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isOnChatPage =
        location.pathname === '/chat' || location.pathname === '/chatbot' || location.pathname === '/video';
    const handleClick = () => {
        if (!user.auth) {
            setShowModal(true);
        } else {
            navigate('/chatbot');
        }
    };
    return (
        <>
            {!isOnChatPage && (
                <div className="fixed bottom-6 right-3 z-50">
                    <button
                        onClick={handleClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                        aria-label="Trợ lý AI"
                    >
                        <img src="/robot.png" alt="chatbot" className="w-8 h-8" />
                        <span className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></span>
                        <div
                            className={`absolute bottom-full right-0 mb-2 whitespace-nowrap bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md text-sm font-medium transition-all duration-200 ${
                                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                            }`}
                        >
                            Trợ lý AI
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
                                Bạn cần đăng nhập để sử dụng chức năng Trợ lý AI. Vui lòng đăng nhập để tiếp tục.
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

export default ChatBotAIButton;
