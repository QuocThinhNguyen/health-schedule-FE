import Input from '~/components/Input';
import { io } from 'socket.io-client';
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '~/context/UserContext';

function TextChat() {
    const { user } = useContext(UserContext);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    // const socket = io(' http://localhost:9000', {
    //     query: { userId: userId },
    // });

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_REACT_APP_BACKEND_URL, {
            auth: { userId: user.userId },
        });

        socketRef.current.on('server_send_message', (data) => {
            console.log('data recieve FE:', data);
            setMessages((prev) => [...prev, data]);
        });

        socketRef.current.on('disconnect', () => {
            console.log('disconnected from server FE:' + socketRef.current.id);
        });

        socketRef.current.on('connect_error', (err) => {
            console.log('connect_error:', err);
        });

        return () => {
            socketRef.current.disconnect();
            console.log('disconnected from server FE:' + socketRef.current.id);
        };
    }, []);

    const handleClickJoin = () => {
        console.log('name FE:', name);
        console.log('room FE:', room);

        socketRef.current?.emit('join_room', room);
        toast.success(name + ' joined room ' + room);
        console.log('join room FE:', room);
    };

    const handleClickSend = () => {
        console.log('name send FE:', name);
        console.log('room send FE:', room);
        console.log('message send FE:', message);
        const data = {
            name: name,
            message: message,
        };
        socketRef.current?.emit('client_send_message', {
            chatRoomId: room,
            content: message,
            type: 'text',
        });
        setMessage('');
    };

    return (
        <>
            <Input id="name" label="Ten" placeholder="yourName" type="text" onChange={(e) => setName(e.target.value)} />
            <Input
                id="room"
                label="Phong"
                placeholder="YourRoon"
                type="text"
                onChange={(e) => setRoom(e.target.value)}
            />

            <button onClick={handleClickJoin} className="mt-4 px-3 py-2 bg-blue-500 text-white" id="btn_join">
                Join
            </button>
            <Input
                id="message"
                label="Tin nhan"
                placeholder="Nhap tin nhan"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleClickSend} className="mt-4 px-3 py-2 bg-blue-500 text-white" id="btn_send">
                Gui tin nhan
            </button>
            {messages.length > 0 &&
                messages.map((message, index) => (
                    <div key={index} className="bg-gray-200 p-2 my-2 rounded-md">
                        {message.sendId}: {message.content}
                    </div>
                ))}
        </>
    );
}

export default TextChat;
