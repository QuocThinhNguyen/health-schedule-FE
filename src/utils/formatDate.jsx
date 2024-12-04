function formatDate(dateString) {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-GB');

    const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${formattedDate}, ${formattedTime}`;
}

export default formatDate;
