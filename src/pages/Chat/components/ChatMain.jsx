import { useState, useRef, useEffect, useContext } from 'react';
import { FiSend, FiPaperclip, FiMic, FiMoreVertical, FiPhone, FiVideo, FiSmile } from 'react-icons/fi';
import ChatMessage from './ChatMessage';
import { UserContext } from '~/context/UserContext';
import { useSocket } from '../useSocket';
import { axiosClient } from '~/api/apiRequest';
import { AiFillLike } from 'react-icons/ai';
import { IoSend } from 'react-icons/io5';
import { IoIosSend } from 'react-icons/io';
import { formatTimeAgo } from '~/utils/formatTimeAgo';

export default function ChatMain({ activeChat }) {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [partner, setPartner] = useState();

    const { user } = useContext(UserContext);
    if (!user) {
        console.error('User is not defined');
        return null;
    }
    const socket = useSocket(user?.userId);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    // const [messages, setMessages] = useState([
    //     {
    //         id: 1,
    //         text: 'Hey there! How are you doing?',
    //         sender: 'them',
    //         time: '10:30 AM',
    //         status: 'read',
    //     },
    //     {
    //         id: 2,
    //         text: "I'm good, thanks for asking! How about you?",
    //         sender: 'me',
    //         time: '10:32 AM',
    //         status: 'read',
    //     },
    //     {
    //         id: 3,
    //         text: "I'm doing well. Just working on that project we discussed last week.",
    //         sender: 'them',
    //         time: '10:33 AM',
    //         status: 'read',
    //     },
    //     {
    //         id: 4,
    //         text: "Oh great! How's it coming along? Do you need any help with it?",
    //         sender: 'me',
    //         time: '10:35 AM',
    //         status: 'delivered',
    //     },
    //     {
    //         id: 5,
    //         text: "It's going well, but I could use some help with the design part. Are you free this afternoon for a quick call?",
    //         sender: 'them',
    //         time: '10:36 AM',
    //         status: 'read',
    //     },
    // ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        console.log('messagesEndRef', messagesEndRef.current);
    };

    useEffect(() => {
        const fetchMessageByChatRoomId = async () => {
            try {
                const response = await axiosClient.get(`/chat-message/${activeChat?.chatRoomId}`);
                console.log('response fetchMessageByChatRoomId', response);
                if (response.status === 200) {
                    setMessages(response.data);
                } else {
                    console.error('No clinics are found:', response.message);
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessages([]);
            }
        };
        fetchMessageByChatRoomId();
    }, [activeChat]);

    useEffect(() => {
        socket.on('server_send_message', (data) => {
            console.log('data recieve FE:', data);
            setMessages((prev) => [...prev, data]);
        });
    }, []);

    useEffect(() => {
        if (activeChat) {
            setPartner(activeChat?.partner);
        }
    }, [activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        socket.emit('client_send_message', {
            chatRoomId: activeChat?.chatRoomId,
            content: message.trim(),
            type: 'text',
        });
        setMessage('');
    };
    console.log('activeChat', activeChat);

    return activeChat ? (
        <div className="flex flex-col h-full">
            <div className="bg-white px-4 py-[10px] border-b flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                    <div className="relative">
                        <img
                            src={
                                partner?.partner?.image
                                    ? `${IMAGE_URL}${partner?.partner?.image}`
                                    : 'https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/hinh-nen-anime-2.jpg'
                            }
                            alt={partner?.partner?.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* {partner?.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )} */}
                    </div>
                    <div className="ml-3">
                        <h2 className="text-lg font-medium text-gray-900">{partner?.partner?.fullname}</h2>
                        <p className="text-xs text-gray-500">
                            {partner && partner?.partner?.roleId === 'R1'
                                ? 'Admin'
                                : partner?.partner?.roleId === 'R2'
                                ? 'Bác sĩ'
                                : 'Bệnh nhân'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[var(--bg-secondary)]">
                <div>
                    <div className="w-full h-5"></div>
                    {messages.map((message, index) => (
                        <ChatMessage
                            key={index}
                            activeChat={activeChat}
                            message={message}
                            previousMessage={messages[index - 1]}
                            nextMessage={messages[index + 1]}
                        />
                    ))}
                    <div className="w-full h-5"></div>
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            <div className="bg-white px-3 py-[10px] border-t">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Aa"
                            className="w-full outline-none"
                        />
                    </div>
                    {message.trim() === '' ? (
                        <button
                            type="button"
                            className="mx-1 w-[34px] h-[34px] p-1 text-[var(--bg-active)] rounded-full hover:bg-gray-200"
                        >
                            <svg aria-hidden="true" class="xsrhx6k" height="20" viewBox="0 0 22 23" width="20">
                                <path
                                    d="M10.987 0c1.104 0 3.67.726 3.67 5.149 0 1.232-.123 2.001-.209 2.534a16.11 16.11 0 00-.048.314l-.001.005a.36.36 0 00.362.406c4.399 0 6.748 1.164 6.748 2.353 0 .533-.2 1.02-.527 1.395a.11.11 0 00.023.163 2.13 2.13 0 01.992 1.79c0 .86-.477 1.598-1.215 1.943a.11.11 0 00-.046.157c.207.328.329.713.329 1.128 0 .946-.547 1.741-1.406 2.029a.109.109 0 00-.068.137c.061.184.098.38.098.584 0 1.056-1.776 1.913-5.95 1.913-3.05 0-5.154-.545-5.963-.936-.595-.288-1.276-.81-1.276-2.34v-6.086c0-1.72.958-2.87 1.911-4.014C9.357 7.49 10.3 6.36 10.3 4.681c0-1.34-.091-2.19-.159-2.817-.039-.368-.07-.66-.07-.928 0-.527.385-.934.917-.936zM3.5 11h-2C.5 11 0 13.686 0 17s.5 6 1.5 6h2a1 1 0 001-1V12a1 1 0 00-1-1z"
                                    fill="var(--bg-active)"
                                ></path>
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="mx-1 w-[34px] h-[34px] p-1 text-[var(--bg-active)] rounded-full  hover:bg-gray-200"
                        >
                            <svg class="xsrhx6k" height="20px" viewBox="0 0 24 24" width="20px">
                                <path
                                    d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                                    fill="var(--bg-active)"
                                ></path>
                            </svg>
                        </button>
                    )}
                </form>
            </div>
        </div>
    ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-medium text-gray-600">Select a chat to start messaging</h2>
                <p className="text-gray-500 mt-2">Choose from your existing conversations or start a new one</p>
            </div>
        </div>
    );
}
