import React, { useState, useEffect, useContext } from 'react';
import { Await, useSearchParams } from 'react-router-dom'; // Dùng để lấy `patientRecordId` từ URL
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest'; // Đảm bảo bạn đã config axios

function UpdateRecord() {
    const [formData, setFormData] = useState({
        fullname: '',
        birthDate: '',
        phoneNumber: '',
        gender: '',
        job: '',
        CCCD: '',
        email: '',
        address: '',
    });

    const [searchParams] = useSearchParams();
    const recordId = searchParams.get('id');
    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                const response = await axiosInstance.get(`/patientrecord/${recordId}`);
                console.log('RESPONSE', response);
                console.log('DATA', response.data);
                if (response.status === 200) {
                    const data = response.data;
                    setFormData({
                        fullname: response.data.fullname || '',
                        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                        phoneNumber: data.phoneNumber || '',
                        gender: data.gender === 'Male' ? 'Nam' : 'Nữ',
                        job: data.job || '',
                        CCCD: data.CCCD || '',
                        email: data.email || '',
                        address: data.address || '',
                    });
                }
            } catch (error) {
                console.log('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecordData();
    }, [recordId]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        try {
            const response = await axiosInstance.put(`/patientrecord/${recordId}`, formData);
            console.log('Response Update:', response);
            if (response.status === 200) {
                toast.success('Cập nhật thông tin thành công');
            } else {
                toast.error('Cập nhật thông tin thất bại');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };
    console.log('formData:', formData);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50">
            <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">Cập nhật thông tin bệnh nhân</h1>

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
                            value={formData.gender}
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
                        type="submit"
                        className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateRecord;
