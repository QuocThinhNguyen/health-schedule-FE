export const formatTitleForUrl = (title) => {
    // Chuyển chữ cái đầu tiên thành chữ thường nếu là chữ có dấu
    const fullChar = title
        .normalize('NFD') // Tách các ký tự có dấu thành ký tự cơ bản và dấu
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu diacritics
        .replace(/Đ/g, 'd') // Thay Đ thành d
        .replace(/đ/g, 'd') // Thay đ thành d
        .toLowerCase() // Chuyển thành chữ thường
        .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch nối
        .replace(/[^a-z0-9\-]/g, '') // Xóa các ký tự không hợp lệ (chỉ để lại chữ cái, số và dấu gạch nối)
        .replace(/-+$/g, ''); // Xóa dấu gạch nối dư thừa ở cuối chuỗi

    return fullChar; // Kết hợp chữ cái đầu và phần còn lại
};
