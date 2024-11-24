import React, { useState } from 'react';

const PatientInfo = ({ initialData, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(
        initialData || {
            fullName: '',
            birthYear: '',
            birthMonth: '',
            birthDay: '',
            phone: '',
            gender: 'Nam',
            occupation: '',
            idNumber: '',
            email: '',
            ethnicity: 'Kinh',
            province: '',
            district: '',
            ward: '',
            address: '',
        },
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Gửi dữ liệu tới hàm onSubmit
    };

    return (
        <div className="modal bg-white p-6 rounded shadow-lg max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{initialData ? 'Sửa Hồ Sơ Bệnh Nhân' : 'Thêm Hồ Sơ Bệnh Nhân'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Các trường nhập liệu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    {/* ... Các trường nhập liệu khác */}
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientInfo;
