import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

export function formatTimeAgo(dateString) {
  return dayjs.utc(dateString).tz("Asia/Ho_Chi_Minh").fromNow();
}
