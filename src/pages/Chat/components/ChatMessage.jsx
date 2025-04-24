import { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '~/context/UserContext';
import { formatTime } from '~/utils/formatDate';
import MessageDateSeparator from './MessageDateSeparator';

function ChatMessage({ activeChat, message, previousMessage, nextMessage }) {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const { user } = useContext(UserContext);
    const { image, fullname } = activeChat?.partner?.partner || {};
    const { senderId, content, createdAt } = message;

    const isMe = senderId === user?.userId;
    const showAvatar = !isMe && senderId !== previousMessage?.senderId;
    const isSameSender = senderId === nextMessage?.senderId;

    const currentTime = new Date(createdAt);
    const prevTime = previousMessage ? new Date(previousMessage.createdAt) : null;
    const shouldShowDateSeparator =
        !previousMessage ||
        currentTime.toDateString() !== prevTime.toDateString() ||
        currentTime - prevTime > 2 * 60 * 60 * 1000;

    return (
        <>
            {shouldShowDateSeparator && <MessageDateSeparator date={createdAt} />}
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
                    } rounded-md px-3 py-2 shadow-sm border border-[var(--border-primary)] flex flex-col justify-center items-start `}
                >
                    <p className="break-words w-full max-w-full text-justify leading-5">{content}</p>
                    {isSameSender === false ? <p className="text-xs mt-[6px]">{formatTime(createdAt)}</p> : ''}
                </div>
            </div>
        </>
    );
}

ChatMessage.propTypes = {
    activeChat: PropTypes.shape({
        partner: PropTypes.shape({
            partner: PropTypes.shape({
                image: PropTypes.string,
                fullname: PropTypes.string,
            }),
        }),
    }),
    message: PropTypes.shape({
        senderId: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        type: PropTypes.string,
        status: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
    previousMessage: PropTypes.shape({
        senderId: PropTypes.number,
        createdAt: PropTypes.string,
    }),
    nextMessage: PropTypes.shape({
        senderId: PropTypes.number,
    }),
};

export default ChatMessage;
