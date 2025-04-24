import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import ChatMessage from './ChatMessage';
import { UserContext } from '~/context/UserContext';
import { useSocket } from '../useSocket';
import { axiosClient } from '~/api/apiRequest';

export default function ChatMain({ activeChat }) {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [partner, setPartner] = useState();

    const { user } = useContext(UserContext);
    const socket = useSocket(user?.userId);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const currentChatRoomIdRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'end',
            inline: 'nearest',
        });
    };

    useEffect(() => {
        if (activeChat?.chatRoomId !== currentChatRoomIdRef.current) {
            setMessages([]);
            setHasMore(true);
            currentChatRoomIdRef.current = activeChat?.chatRoomId;
        }
        fetchMessageByChatRoomId();
    }, [activeChat, socket]);

    const fetchMessageByChatRoomId = useCallback(
        async (lastMessageTime = null, shouldScroll = false) => {
            if (!activeChat?.chatRoomId || (lastMessageTime && isLoadingMore)) return;
            if (lastMessageTime) {
                setIsLoadingMore(true);
            }
            try {
                let url = `/chat-message/${activeChat?.chatRoomId}`;
                if (lastMessageTime) {
                    url = `${url}?lastMessageTime=${lastMessageTime}`;
                }
                const response = await axiosClient.get(url);
                if (response.status === 200) {
                    const newMessages = response.data;
                    if (newMessages.length === 0) {
                        setHasMore(false);
                        return;
                    }
                    if (lastMessageTime) {
                        setMessages((prev) => {
                            const existingMessageIds = new Set(prev.map((msg) => msg._id));
                            const uniqueNewMessages = newMessages.filter((msg) => !existingMessageIds.has(msg._id));
                            return [...uniqueNewMessages, ...prev];
                        });
                    } else {
                        setMessages(newMessages);
                    }
                    if (shouldScroll && messageContainerRef.current) {
                        setTimeout(() => {
                            // const scrollHeight = messageContainerRef.current.scrollHeight;
                            // messageContainerRef.current.scrollTop = 200;
                            scrollToBottom();
                        }, 100);
                    }
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                if (lastMessageTime) {
                    setIsLoadingMore(false);
                }
            }
        },
        [activeChat?.chatRoomId, isLoadingMore],
    );

    useEffect(() => {
        const container = messageContainerRef.current;
        const handleScroll = () => {
            if (container.scrollTop < 100 && hasMore && !isLoadingMore) {
                const oldestMessage = messages[0];
                const oldestMessageTime = oldestMessage ? oldestMessage.createdAt : null;
                if (oldestMessageTime) {
                    fetchMessageByChatRoomId(oldestMessageTime, true);
                }
            }
        };
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [messages, hasMore, activeChat, fetchMessageByChatRoomId, isLoadingMore]);

    useEffect(() => {
        const handleNewMessage = (data) => {
            if (data.chatRoomId === activeChat?.chatRoomId) {
                setMessages((prev) => [...prev, data]);
            }
        };
        socket.on('server_send_message', handleNewMessage);
        return () => {
            socket.off('server_send_message', handleNewMessage);
        };
    }, [activeChat]);

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

            <div ref={messageContainerRef} className="flex-1 overflow-y-auto bg-[var(--bg-secondary)]">
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
                            className="mx-1 w-[34px] h-[34px] p-2 text-[var(--bg-active)] rounded-ful disable cursor-default opacity-75"
                        >
                            <svg className="xsrhx6k" height="20px" viewBox="0 0 24 24" width="20px">
                                <path
                                    d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                                    fill="var(--bg-active)"
                                ></path>
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="mx-1 w-[34px] h-[34px] p-2 text-[var(--bg-active)] rounded-full hover:bg-gray-200"
                        >
                            <svg className="xsrhx6k" height="20px" viewBox="0 0 24 24" width="20px">
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
                <h2 className="text-xl font-medium text-[var(--text-primary)]">
                    Chọn một cuộc trò chuyện để bắt đầu nhắn tin
                </h2>
                <p className="text-[var(--text-secondary)] mt-2">
                    Chọn từ các cuộc trò chuyện hiện tại của bạn hoặc bắt đầu một cuộc trò chuyện mới
                </p>
            </div>
        </div>
    );
}
