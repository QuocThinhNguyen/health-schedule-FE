import { formatMessageTime } from "~/utils/formatDate";
import PropTypes from "prop-types";

function MessageDateSeparator({ date }) {
    const formattedDate = formatMessageTime(date);

    return (
        <div className="relative text-center text-sm py-2">
            <span className="px-4 py-1 bg-[var(--bg-primary)] rounded-full shadow inline-block">{formattedDate}</span>
        </div>
    );
}
MessageDateSeparator.propTypes = {
    date: PropTypes.string.isRequired,
};

export default MessageDateSeparator;
