import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import defaultImage from '../../assets/img/avatar.png';
import { Camera, Pencil } from 'lucide-react';

function DoctorProfile() {
    const [doctorInfo, setDoctorInfo] = useState({
        name: '',
        address: '',
        gender: '',
        birthdate: '',
        phone: '',
        email: '',
        image: '',
    });

    const { user } = useContext(UserContext);

    const [selectedFile, setSelectedFile] = useState(null); // Thêm trạng thái để lưu trữ tệp ảnh
    const [previewImage, setPreviewImage] = useState(null); // Thêm trạng thái để lưu trữ URL tạm thời của ảnh

    console.log('Image', selectedFile);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/user/${user.userId}`);
                console.log('Response:', response);

                if (response.status === 200) {
                    setDoctorInfo({
                        name: response.data.fullname,
                        address: response.data.address,
                        gender: response.data.gender === 'Male' ? 'Nam' : 'Nữ',
                        birthdate: response.data.birthDate,
                        specialty: response.data.specialtyName,
                        phone: response.data.phoneNumber,
                        email: response.data.email,
                        clinic: response.data.clinicName,
                        position: response.data.position,
                        image: response.data.image,
                    });
                }
                // console.log('Doctor data:', response.data);
                // console.log('Doctor info:', doctorInfo);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
                setDoctorInfo({});
            }
        };
        fetchData();
    }, []);

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setSelectedFile(file); // Lưu trữ tệp ảnh trong trạng thái
            setPreviewImage(URL.createObjectURL(file)); // Tạo URL tạm thời cho ảnh và lưu trữ trong trạng thái
        } else {
            setDoctorInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
        }
    };

    const handleSave = async () => {
        setIsEditing(false);

        console.log('Updating doctor data:', doctorInfo);

        const formData = new FormData();
        formData.append('fullname', doctorInfo.name);
        formData.append('address', doctorInfo.address);
        const genderValue = doctorInfo.gender === 'Nam' ? 'Male' : doctorInfo.gender === 'Nữ' ? 'Female' : 'Other';
        formData.append('gender', genderValue);
        formData.append('birthDate', doctorInfo.birthdate);
        formData.append('phoneNumber', doctorInfo.phone);
        formData.append('email', doctorInfo.email);
        if (selectedFile) {
            formData.append('image', selectedFile); // Thêm tệp ảnh vào FormData
        }
        console.log('FormData:', formData);
        try {
            const response = await axiosInstance.put(`/user/${user.userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response);
            if (response.status === 200) {
                // Check a success code if the backend provides it
                toast.success('Cập nhật thông tin thành công');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.warn(response.data.message || 'Đã xảy ra vấn đề');
            }
        } catch (error) {
            // console.error('Error updating doctor data:', error);
            toast.error('Cập nhật thông tin thất bại');
        }
    };

    console.log('doctorinfo', doctorInfo);

    const IMAGE_URL = 'http://localhost:9000/uploads/';
    const doctorInfo_Image = {
        image: doctorInfo.image,
    };

    return (
        <div className="mt-20 h-fit overflow-y-auto max-w-xl">
            {/* <h2 className="text-5xl font-bold text-center mb-6">Thông Tin Cá Nhân Bác Sĩ</h2> */}
            <div className="flex items-center justify-between mb-8">
                <div className="text-2xl font-bold">Hồ sơ</div>
                {!isEditing && (
                    <button
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        onClick={() => setIsEditing(true)}
                    >
                        <div className="font-bold text-sm text-[#2D87F3]">Chỉnh sửa</div>
                        <Pencil className="w-4 h-4" />
                    </button>
                )}
            </div>
            {/* Ảnh Avatar */}
            <div className=" flex justify-start mb-6 relative">
                <img
                    src={previewImage || (doctorInfo.image ? `${IMAGE_URL}${doctorInfo.image}` : defaultImage)} // Thay thế URL này bằng link ảnh thực tế của bác sĩ
                    alt="Doctor Avatar"
                    className="w-32 h-32 rounded-full border-2 border-gray-300"
                />
                {isEditing && (
                    <div>
                        <label htmlFor="imageUpload" className="cursor-pointer">
                            <FaCamera className="w-6 h-6 text-gray-600" />
                        </label>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </div>
                )}
                <div className="mt-5 ml-5">
                    <div className="font-bold text-lg">{doctorInfo.name}</div>
                    <div className="text-base text-blue-500">{doctorInfo.email}</div>
                </div>
            </div>

            {/* Thông tin cá nhân */}
            <div
                className={`space-y-4 px-5 py-5  ${
                    isEditing ? 'bg-[#f8f9fc]' : 'border rounded-lg bg-white shadow-sm'
                }`}
            >
                <div className={` ${isEditing ? '' : 'border-b pb-4'}`}>
                    <div className="block text-sm font-semibold text-gray-600 mb-1">Họ và tên</div>
                    <input
                        type="text"
                        name="name"
                        value={doctorInfo.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={` ${isEditing ? 'bg-white w-full p-2 border rounded' : 'bg-white'}`}
                    />
                </div>

                <div className={` ${isEditing ? '' : 'border-b pb-4'}`}>
                    <div className="block text-sm font-semibold text-gray-600 mb-1">Email</div>
                    <input
                        type="email"
                        name="email"
                        value={doctorInfo.email}
                        onChange={handleChange}
                        disabled={true}
                        className={`cursor-not-allowed w-1/2 ${
                            isEditing ? 'bg-white w-full p-2 border rounded' : 'bg-white'
                        }`}
                    />
                </div>

                <div className={` ${isEditing ? '' : 'border-b pb-4'}`}>
                    <div className="block text-sm font-semibold text-gray-500 mb-1">Ngày sinh</div>
                    <input
                        type="date"
                        name="birthdate"
                        value={doctorInfo.birthdate}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={` ${isEditing ? 'bg-white w-full p-2 border rounded' : 'bg-white'}`}
                    />
                </div>

                <div className={` ${isEditing ? '' : 'border-b pb-4'}`}>
                    <div className="block text-sm font-semibold text-gray-500 mb-1">Giới tính</div>
                    {isEditing ? (
                        <select
                            name="gender"
                            value={doctorInfo.gender}
                            onChange={handleChange}
                            className="bg-white w-full p-2 border rounded"
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            name="gender"
                            value={doctorInfo.gender}
                            disabled={!isEditing}
                            className="bg-white"
                        />
                    )}
                </div>

                <div className={` ${isEditing ? '' : 'border-b pb-4'}`}>
                    <div className="block text-sm font-semibold text-gray-500 mb-1">Số điện thoại</div>
                    <input
                        type="text"
                        name="phone"
                        value={doctorInfo.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={` ${isEditing ? 'bg-white w-full p-2 border rounded' : 'bg-white'}`}
                    />
                </div>

                <div>
                    <div className="block text-sm font-semibold text-gray-500 mb-1">Địa chỉ</div>
                    <input
                        type="text"
                        name="address"
                        value={doctorInfo.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={` ${isEditing ? 'bg-white w-full p-2 border rounded' : 'bg-white'}`}
                    />
                </div>
            </div>

            {/* Nút Chỉnh sửa và Lưu */}
            <div className="flex justify-start space-x-4 mb-5">
                {isEditing ? (
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-0 bg-[#f8f9fc] text-blue-500 font-semibold text-lg rounded border-blue-500 border-2 hover:bg-blue-500 hover:text-white"
                    >
                        Hủy
                    </button>
                ) : null}
                {isEditing && (
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-400 text-lg font-semibold text-white rounded hover:bg-blue-500"
                    >
                        Lưu thay đổi
                    </button>
                )}
            </div>
        </div>
    );
}

export default DoctorProfile;
