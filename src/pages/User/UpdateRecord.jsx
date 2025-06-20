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
                    console.log('DATA:', data);
                    setFormData({
                        fullname: response.data.fullname || '',
                        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                        phoneNumber: data.phoneNumber || '',
                        gender: data.gender,
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
        if (!formData.fullname) {
            toast.error('Vui lòng nhập họ và tên');
            return;
        }
        if (!formData.birthDate) {
            toast.error('Vui lòng nhập ngày sinh');
            return;
        }
        if (!formData.phoneNumber) {
            toast.error('Vui lòng nhập số điện thoại');
            return;
        }
        if (!formData.job) {
            toast.error('Vui lòng nhập nghề nghiệp');
            return;
        }
        if (!formData.CCCD) {
            toast.error('Vui lòng nhập số CCCD/Passport');
            return;
        }
        if (!formData.email) {
            toast.error('Vui lòng nhập địa chỉ email');
            return;
        }
        if (!formData.address) {
            toast.error('Vui lòng nhập địa chỉ hiện tại');
            return;
        }
        e.preventDefault();
        // console.log('Form submitted:', formData);
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
        <div className="mt-20 h-fit overflow-y-auto max-w-2xl">
            <h1 className="text-2xl font-bold text-left text-gray-800 mb-6">Cập nhật thông tin bệnh nhân</h1>

            <p className="text-red-500 mb-4 mt-6">(*) Thông tin bắt buộc nhập</p>

            <form onSubmit={handleSubmit} className="space-y-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-2 mr-2">
                    {/* Full Name */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Họ và tên (có dấu) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Nhập họ và tên"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 focus:outline-none"
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
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 focus:outline-none"
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
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 focus:outline-none"
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
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="">Chọn giới tính ...</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
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
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 focus:outline-none"
                            required
                            placeholder="Nhập nghề nghiệp"
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
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 focus:outline-none"
                            required
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
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 focus:outline-none"
                            required
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
                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6 mr-2">
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
