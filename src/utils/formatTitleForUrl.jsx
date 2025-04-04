export const formatTitleForUrl = (title) => {
    const fullChar = title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/Đ/g, 'd')
        .replace(/đ/g, 'd')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/-+$/g, '');
    return fullChar;
};
