import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

export function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    const formattedDate = date.toLocaleDateString('vi-VN');
    return `${formattedDate}`;
}

export function formatWithInputDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return ''; // Trả về chuỗi rỗng nếu ngày không hợp lệ
    }

    // Tạo chuỗi YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Time';
    }
    const formattedTime = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${formattedTime}`;
}

export const formatMessageTime = (datetime) => {
    const d = dayjs(datetime);
    const now = dayjs();
    const time = d.format('HH:mm');
    if (d.isSame(now, 'day')) {
        return `${time} Hôm nay`;
    }
    if (d.isSame(now.subtract(1, 'day'), 'day')) {
        return `${time} Hôm qua`;
    }
    return `${time} ${d.format('DD/MM/YYYY')}`;
};
