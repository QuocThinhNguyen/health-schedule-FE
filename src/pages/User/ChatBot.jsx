import { useState, useEffect, useContext, useRef } from 'react';
import { axiosInstance } from '~/api/apiRequest'; // Đảm bảo bạn đã config axios
import { Send } from 'lucide-react';
import { UserContext } from '~/context/UserContext';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [sessionId, setSessionId] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const messagesEndRef = useRef(null); // Tạo ref cho phần cuối danh sách tin nhắn

    useEffect(() => {
        // Cuộn xuống cuối cùng khi messages thay đổi
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    }, [messages]);

    useEffect(() => {
        const newSessionId = `${user.userId}_${Date.now()}`;
        localStorage.setItem('chatSessionId', newSessionId);
        setSessionId(newSessionId);
    }, [user.userId]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axiosInstance.get(`/chatbot/${user.userId}`);
                if (response.status === 200) {
                    setHistory(response.data);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchHistory();
    }, [user.userId]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get(`/user/${user.userId}`);
                if (response.status === 200) {
                    setUserProfile(response.data);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchUserProfile();
    }, [user.userId]);

    const sendMessage = async () => {
        if (!message.trim()) return;
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessages = [...messages, { sender: 'user', text: message, time: currentTime }];
        setMessages(newMessages);
        setShowIntro(false);
        setMessage('');
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(`/chatbot/${user.userId}/${sessionId}`, { message });
            if (response.status === 200) {
                // setMessages([
                //     ...newMessages,
                //     {
                //         sender: 'bot',
                //         text: response.data,
                //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                //     },
                // ]);

                const botReply = {
                    sender: 'bot',
                    text: response.data,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };

                // Thêm tin nhắn của bot vào danh sách
                const updatedMessages = [...newMessages, botReply];
                setMessages(updatedMessages); // Cập nhật state với tin nhắn bot

                // Gửi danh sách tin nhắn mới nhất đến API
                const request = {
                    messages: updatedMessages,
                    sessionId: sessionId,
                };

                try {
                    const response = await axiosInstance.put(`/chatbot/${user.userId}`, request);
                    if (response.status === 200) {
                        console.log('Lưu tin nhắn thành công!');
                    }
                } catch (error) {
                    console.log('Error:', error);
                }
            }
        } catch (error) {
            console.log('Error:', error);
            setMessages([
                ...newMessages,
                {
                    sender: 'bot',
                    text: 'Xin lỗi, có lỗi xảy ra!',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        }
        setIsLoading(false);
    };

    const formatResponse = (text) => {
        if (!text) return '';
        return String(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // In đậm nội dung quan trọng
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Chữ nghiêng
            .replace(/\n/g, '<br />'); // Xuống dòng
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Ngăn xuống dòng trong input
            sendMessage();
            setMessage('');
        }
    };

    const getDetailMessage = (chatbotMessageId, sessionId) => async () => {
        try {
            const response = await axiosInstance.get(`/chatbot/detail/${chatbotMessageId}`);
            if (response.status === 200) {
                setMessages(response.data.messages);
                setShowIntro(false);
                setSelectedChatId(chatbotMessageId);
                setSessionId(sessionId);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="flex w-full h-screen-minus-20 overflow-hidden">
            {/* Cột trái */}
            <div className=" h-full flex flex-col w-64 bg-[#e3f2ff]  space-y-5">
                <div className="flex items-center justify-start h-fit p-4">
                    <img src="/robot.png" className="w-10 h-10 border rounded-full" />
                    <div className="ml-3">
                        <p className="font-medium text-base">Medigo Trợ lý sức khỏe</p>
                        <p className="text-sm text-gray-500">Trợ lý y tế thông minh</p>
                    </div>
                </div>
                <div className="space-y-5 border-t pt-5 overflow-y-auto p-2">
                    {/* <input
                        className="flex-1 border rounded-lg p-2 h-10 outline-none w-full shadow-md"
                        placeholder="Tìm kiếm cuộc trò chuyện"
                    /> */}
                    <div
                        className="text-center border bg-blue-500 rounded-lg text-white py-2 cursor-pointer hover:bg-blue-600"
                        onClick={handleReload}
                    >
                        Cuộc trò chuyện mới
                    </div>
                    <p className="text-center text-gray-500">Cuộc trò chuyện gần đây</p>

                    {/* history khác rỗng */}
                    {history.length === 0 ? (
                        <div className="text-center text-gray-600">Không có lịch sử trò chuyện</div>
                    ) : (
                        history.map((item, index) => (
                            <div
                                className={`flex items-center justify-start h-fit border p-2 rounded-lg cursor-pointer hover:bg-blue-300 ${
                                    selectedChatId === item.chatbotMessageId ? 'bg-blue-200' : 'bg-gray-100'
                                } `}
                                key={index}
                                onClick={getDetailMessage(item.chatbotMessageId, item.sessionId)}
                            >
                                <div className="ml-3">
                                    <p className="font-medium text-sm">
                                        {item.messages[0].text.charAt(0).toUpperCase() + item.messages[0].text.slice(1)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Cột phải */}
            <div className="h-full flex-1 flex-col flex relative">
                {/* Header */}
                <div className="px-6 py-2 border-b">
                    <p className="font-medium text-base">Tư vấn sức khỏe</p>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Trực tuyến</p>
                    </div>
                </div>
                {/* Message */}
                <div className="flex-1 flex flex-col h-full max-h-[calc(100vh-100px)] overflow-y-auto bg-[#f9fafb] p-4 space-y-4">
                    {showIntro && (
                        <div className="w-full h-full items-center justify-center flex">
                            <div className="flex flex-col items-center">
                                <img src="/chat.png" alt="chat" className="w-32 h-32" />
                                <p className="text-center text-2xl font-semibold self-center bg-gradient-to-r from-[#49BCE2] to-[#FFC10E] bg-clip-text text-transparent">
                                    Chăm sóc sức khỏe thông minh
                                </p>
                                <p className="text-center text-xl font-semibold self-center bg-gradient-to-r from-[#49BCE2] to-[#FFC10E] bg-clip-text text-transparent">
                                    Đặt lịch nhanh, tư vấn chuẩn!
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Avatar */}
                            {msg.sender === 'bot' && (
                                <img src="/robot.png" alt="ChatBot" className="w-8 h-8 rounded-full mr-2" />
                            )}

                            <div>
                                <div
                                    className={`p-3 max-w-xs md:max-w-xl rounded-lg shadow-md ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-500 text-white rounded-tr-none'
                                            : 'bg-gray-200 text-gray-900 rounded-tl-none'
                                    }`}
                                >
                                    {/* <p>{msg.text}</p> */}
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">{msg.time}</p>
                            </div>
                            {msg.sender === 'user' && (
                                <img src={userProfile.image} alt="User" className="w-8 h-8 rounded-full ml-2" />
                            )}
                        </div>
                    ))}

                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                className="flex justify-start"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <img src="/robot.png" alt="ChatBot" className="w-8 h-8 rounded-full mr-2" />
                                <div className="bg-gray-200 text-gray-900 p-3 rounded-lg shadow-md max-w-xs md:max-w-xl">
                                    <div className="flex space-x-1">
                                        <motion.div
                                            className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                                        />
                                        <motion.div
                                            className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                                        />
                                        <motion.div
                                            className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="py-2 px-4 bottom-0 left-0 right-0 z-10 border-t flex">
                    <div className="w-full flex items-center justify-center gap-2">
                        {/* <button>
                            <img src="/plus.png" className="w-5 h-5" alt="add" />
                        </button> */}
                        <div className="relative w-full">
                            <input
                                className="w-full border rounded-lg p-2 h-10 outline-none shadow-md pr-10"
                                placeholder="EasyMed sẵn sàng hỗ trợ bạn!"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button onClick={sendMessage}>
                                <Send className="w-6 h-6 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer fill-blue-500 stroke-blue-600 hover:fill-blue-600 hover:stroke-blue-700 transition-all duration-200 ease-in-out" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
