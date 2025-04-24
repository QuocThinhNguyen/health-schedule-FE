import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

export  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date'; 
    }
    const formattedDate = date.toLocaleDateString('vi-VN');
    return `${formattedDate}`;
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
    const time = d.format("HH:mm");
    if (d.isSame(now, "day")) {
      return `${time} Hôm nay`;
    }
    if (d.isSame(now.subtract(1, "day"), "day")) {
      return `${time} Hôm qua`;
    }
    return `${time} ${d.format("DD/MM/YYYY")}`;
  };

