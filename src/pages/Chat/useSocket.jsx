import { io } from 'socket.io-client';

let socket;

 const useSocket = (userId) => {
    if (!socket) {
        socket = io('http://localhost:9000', {
            auth: { userId },
        });
        console.log('Socket initialized:', socket);

        console.log('Socket initialized with userId:', userId);

        socket.on('connect', () => {
            console.log('Connected with socket ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (err) => {
            console.log('Socket connect error:', err);
        });
    }

    return socket;
};
 const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export { useSocket, disconnectSocket };
