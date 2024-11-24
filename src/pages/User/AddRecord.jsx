import React, { useState, useEffect, useContext } from 'react';
import { Await, useNavigate, useSearchParams } from 'react-router-dom'; // Dùng để lấy `patientRecordId` từ URL
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest'; // Đảm bảo bạn đã config axios
import { UserContext } from '~/context/UserContext';

function AddRecord() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState({
        patientId: user.userId,
        fullname: '',
        birthDate: '',
        phoneNumber: '',
        gender: '',
        job: '',
        CCCD: '',
        email: '',
        address: '',
    });
    const handleReset = () => {
        setFormData({
            fullname: '',
            birthDate: '',
            phoneNumber: '',
            gender: '',
            job: '',
            CCCD: '',
            email: '',
            address: '',
        });
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'gender' ? (value === 'Nam' ? 'Male' : value === 'Nữ' ? 'Female' : value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted:', formData);
        try {
            console.log('Form submitted:', formData);
            const response = await axiosInstance.post('/patientrecord', formData);
            console.log('API Response:', response);

            if (response.errCode === 0) {
                toast.success(response.message); // Thông báo thành công
                navigate('/user/records')
                handleReset(); // Reset form nếu thành công
            } else {
                toast.error('Tạo mới thất bại: ' + response.message); // Thông báo lỗi
            }
        } catch (error) {
            console.error('Error creating record:', error);
            toast.error('Có lỗi xảy ra khi tạo bản ghi.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50">
            <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">Nhập thông tin bệnh nhân</h1>

            <p className="text-red-500 mb-4 mt-20">(*) Thông tin bắt buộc nhập</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Họ và tên (có dấu) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Nguyễn Văn A"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Vui lòng nhập số điện thoại ..."
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="gender"
                            value={formData.gender === 'Male' ? 'Nam' : formData.gender === 'Female' ? 'Nữ' : ''}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn giới tính ...</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Nghề nghiệp <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="job"
                            value={formData.job}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        />
                    </div>

                    {/* ID Number */}
                    <div>
                        <label className="block mb-1 font-medium">Số CCCD/Passport</label>
                        <input
                            type="text"
                            name="CCCD"
                            placeholder="Vui lòng nhập Số CCCD/Passport"
                            value={formData.CCCD}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Địa chỉ Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập địa chỉ email để nhận phiếu khám"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        />
                    </div>

                    {/* Current Address */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Địa chỉ hiện tại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Nhập địa chỉ hiện tại"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Nhập lại
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    >
                        Tạo mới
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddRecord;
