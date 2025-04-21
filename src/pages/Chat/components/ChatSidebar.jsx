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

    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [friendList, setFriendList] = useState([]);
    const [recentChatList, setRecentChatList] = useState([]);

    useEffect(() => {
        const filterUserAPI = async () => {
            try {
                const response = await axiosInstance.get(`/user/?query=${searchTerm}&page=1&limit=10`);
                if (response.status === 200) {
                    console.log('Fetched response:', response);
                    console.log('Fetched users:', response.data);
                    setFriendList(response.data);
                } else {
                    console.error('No users are found:', response.message);
                    setFriendList([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setFriendList([]);
            }
        };
        filterUserAPI();
    }, [searchTerm]);
    useEffect(() => {
        const fetchRecentChats = async () => {
            try {
                const response = await axiosInstance.get(`/chat-room`);
                if (response.status === 200) {
                    console.log('Fetched recent chats:', response.data);
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

    const handleClickFriend = async (chat) => {
        try {
            const formData = new FormData();
            formData.append('userId', user?.userId);
            formData.append('partnerId', chat?.partner?.userId);
            const response = await axiosInstance.post('/chat-room', formData);
            console.log('Response from getOrCreateRoom:', response);
            if (response.status === 200) {
                setActiveChat({
                    chatRoomId: response.data.chatRoomId,
                    partner: chat,
                });
                const socket = useSocket(user?.userId);
                socket.emit('join_room', response.data.chatRoomId);
            } else {
                console.error('Failed to create clinic:', response.message);
            }
        } catch (error) {
            console.error('Error creating clinic:', error);
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
                                    activeChat?.partner?.userId === chat?.partner?.userId ? 'bg-[#dbebff]' : ''
                                }`}
                                onClick={() => handleClickFriend(chat)}
                            >
                                <div className="relative block shrink-0">
                                    <img
                                        src={
                                            chat?.partner?.image
                                                ? `${IMAGE_URL}${chat?.partner?.image}`
                                                : 'https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/hinh-nen-anime-2.jpg'
                                        }
                                        alt={chat?.partner?.fullname}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                <div className="ml-[10px]  flex-1 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-black font-medium">{chat?.partner?.fullname}</h3>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            {formatTimeAgo(chat?.latestMessage?.createdAt)}
                                        </p>
                                    </div>
                                    {chat?.latestMessage && (
                                        <p className="line-clamp-1 text-sm text-[var(--text-secondary)]">
                                            {chat?.latestMessage?.senderId === user?.userId
                                                ? chat?.partner?.fullname + ': ' + chat?.latestMessage?.content
                                                : 'Bạn: ' + chat?.latestMessage?.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
