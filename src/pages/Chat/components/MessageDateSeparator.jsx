import { formatMessageTime } from "~/utils/formatDate";
import PropTypes from "prop-types";

function MessageDateSeparator({ date }) {
    const formattedDate = formatMessageTime(date);

    return (
        <div className="relative text-center text-sm text-gray-400 py-2">
            <span className="px-4 py-1 bg-white rounded-full shadow inline-block">{formattedDate}</span>
        </div>
    );
}
MessageDateSeparator.propTypes = {
    date: PropTypes.string.isRequired,
};

export default MessageDateSeparator;
