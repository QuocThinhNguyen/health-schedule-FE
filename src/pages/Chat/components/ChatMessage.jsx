import { useContext } from 'react';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import { UserContext } from '~/context/UserContext';

export default function ChatMessage({ activeChat, message, previousMessage, nextMessage }) {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const { user } = useContext(UserContext);
    console.log('activeChat:', activeChat);
    console.log('message:', message);

    const { image, fullname } = activeChat?.partner?.partner;
    const { senderId, content, type, status, createdAt } = message;

    const isMe = senderId === user?.userId;
    const showAvatar = !isMe && senderId !== previousMessage?.senderId;
    const isSameSender = senderId === nextMessage?.senderId;

    return (
        <div className={`flex px-4 ${isSameSender ? 'mb-1' : 'mb-2'} ${isMe ? 'justify-end' : 'justify-start'}`}>
            {showAvatar ? (
                <div className="mr-2">
                    <img
                        src={image && `${IMAGE_URL}${image}`}
                        alt={fullname}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            ) : (
                <div className="mr-2 w-10 h-10"></div>
            )}

            <div
                className={`max-w-[75%] ${
                    isMe ? 'bg-[var(--bg-active)] text-[var(--text-active)]' : 'bg-[var(--bg-primary)]'
                } rounded-md px-3 py-2 shadow-sm border border-[var(--border-primary)] flex justify-center items-center`}
            >
                <p className="break-words w-full max-w-full">{content}</p>
            </div>
        </div>
    );
}
