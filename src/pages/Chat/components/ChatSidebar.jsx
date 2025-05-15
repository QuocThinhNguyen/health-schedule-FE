import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { useSocket } from '../useSocket';
import { IoIosSearch } from 'react-icons/io';
import { formatTimeAgo } from '~/utils/formatTimeAgo';

export default function ChatSidebar({ activeChat, setActiveChat }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(UserContext);
    const socket = useSocket(user?.userId);
    const [recentChatList, setRecentChatList] = useState([]);

    useEffect(() => {
        const fetchRecentChats = async () => {
            try {
                const response = await axiosInstance.get(`/chat-room`);
                if (response.status === 200) {
                    setRecentChatList(response.data);
                } else {
                    console.error('No recent chats found:', response.message);
                    setRecentChatList([]);
                }
            } catch (error) {
                console.error('Error fetching recent chats:', error);
                setRecentChatList([]);
            }
        };
        fetchRecentChats();
    }, []);

    useEffect(() => {
        socket.on('server_sidebar_update', ({ chatRoomId, lastMessage }) => {
            setRecentChatList((prev) => {
                const updatedList = prev.map((chat) =>
                    chat.chatRoomId === chatRoomId
                        ? {
                              ...chat,
                              latestMessage: lastMessage,
                          }
                        : chat,
                );

                const chatToMove = updatedList.find((chat) => chat.chatRoomId === chatRoomId);

                if (chatToMove) {
                    const filteredList = updatedList.filter((chat) => chat.chatRoomId !== chatRoomId);
                    return [chatToMove, ...filteredList];
                }

                return updatedList;
            });
        });   
        
        return () => socket.off('server_sidebar_update');
    }, [socket]);

    const handleClickFriend = async (chat) => {
        try {
            const formData = new FormData();
            formData.append('userId', user?.userId);
            formData.append('partnerId', chat?.partner?.userId);
            const response = await axiosInstance.post('/chat-room', formData);
            if (response.status === 200) {
                setActiveChat({
                    chatRoomId: response.data.chatRoomId,
                    partner: chat,
                });
                socket.emit('join_room', response.data.chatRoomId);
            } else {
                console.error('Failed to create room:', response.message);
            }
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    return (
        <div className="flex flex-col h-full border-r border-[var(--border-primary)]">
            <div className="px-4 py-[10px] flex justify-between items-center">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Đoạn Chat</h1>
            </div>
            <div className="px-4 pb-3 mb-2">
                <div className="relative">
                    <IoIosSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg mt-[2px]" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1 h-9 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {recentChatList.length > 0 &&
                    recentChatList.map((chat, index) => (
                        <div key={index} className="mx-[6px]">
                            <div
                                className={`flex items-center rounded p-[10px] cursor-pointer hover:bg-gray-100 ${
                                    activeChat?.partner?.partner?.userId === chat?.partner?.userId ? 'bg-[#dbebff]' : ''
                                }`}
                                onClick={() => handleClickFriend(chat)}
                            >
                                <div className="relative block shrink-0">
                                    <img
                                        src={chat?.partner?.image}
                                        alt={chat?.partner?.fullname}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                {chat?.latestMessage?.status === 'sent' ? (
                                    <div className="ml-[10px] flex-1 flex flex-col justify-between h-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-black font-medium">{chat?.partner?.fullname}</h3>
                                            <p className="text-xs text-[var(--text-secondary)]">
                                                {formatTimeAgo(chat?.latestMessage?.createdAt)}
                                            </p>
                                        </div>
                                        {chat?.latestMessage && (
                                            <p className="line-clamp-1 text-sm text-[var(--text-secondary)]">
                                                {chat?.latestMessage?.senderId === user?.userId
                                                    ? 'Bạn: ' + chat?.latestMessage?.content
                                                    : chat?.partner?.fullname + ': ' + chat?.latestMessage?.content}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="ml-[10px] flex-1 flex flex-col justify-between h-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-black font-bold">{chat?.partner?.fullname}</h3>
                                            <p className="text-xs text-[var(--text-secondary)] font-medium">
                                                {formatTimeAgo(chat?.latestMessage?.createdAt)}
                                            </p>
                                        </div>
                                        {chat?.latestMessage && (
                                            <>
                                                <p className="line-clamp-1 text-sm text-[var(--text-secondary)] font-medium">
                                                    {chat?.latestMessage?.senderId === user?.userId
                                                        ? 'Bạn: ' + chat?.latestMessage?.content
                                                        : chat?.partner?.fullname + ': ' + chat?.latestMessage?.content}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
