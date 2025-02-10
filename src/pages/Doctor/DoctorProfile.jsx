import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import {
    ChevronRight,
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Stethoscope,
    Calendar,
    Edit2,
    Save,
} from 'lucide-react';

function DoctorProfile() {
    const [doctorInfo, setDoctorInfo] = useState({
        name: '',
        address: '',
        gender: '',
        birthdate: '',
        specialty: '',
        phone: '',
        email: '',
        clinic: '',
        position: '',
        image: '',
    });

    const { user } = useContext(UserContext);

    const [selectedFile, setSelectedFile] = useState(null); // Thêm trạng thái để lưu trữ tệp ảnh
    const [previewImage, setPreviewImage] = useState(null); // Thêm trạng thái để lưu trữ URL tạm thời của ảnh

    console.log('Image', selectedFile);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${user.userId}`);
                if (response.status === 200) {
                    setDoctorInfo({
                        name: response.data.fullname,
                        address: response.data.address,
                        gender: response.data.gender === 'Male' ? 'Nam' : 'Nữ',
                        birthdate: response.data.birthDate.split('T')[0],
                        specialty: response.data.specialtyName,
                        phone: response.data.phoneNumber,
                        email: response.data.email,
                        clinic: response.data.clinicName,
                        position: response.data.position,
                        image: response.data.image,
                    });
                }
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

        try {
            const response = await axiosInstance.put(`/doctor/${user.userId}`, formData, {
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

    return (
        <div className="w-150 h-full px-40 border rounded-lg shadow-lg bg-white overflow-y-auto">
            <div className="max-w-full mx-auto bg-white rounded-lg shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between border-b">
                    <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
                    <button
                        className={`px-4 py-2 rounded-md flex items-center ${
                            isEditing
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    >
                        {isEditing ? (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Lưu
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Chỉnh sửa
                            </>
                        )}
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img
                                    src="/placeholder.svg?height=128&width=128"
                                    alt="Doctor Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {!isEditing && (
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                                    Thay đổi ảnh
                                </button>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Họ và tên', name: 'name', icon: User },
                                    { label: 'Email', name: 'email', icon: Mail },
                                    { label: 'Số điện thoại', name: 'phone', icon: Phone },
                                    { label: 'Địa chỉ', name: 'address', icon: MapPin },
                                    { label: 'Chuyên khoa', name: 'specialization', icon: Stethoscope },
                                    { label: 'Học vấn', name: 'education', icon: GraduationCap },
                                    { label: 'Kinh nghiệm', name: 'experience', icon: Calendar },
                                ].map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                                            {field.label}
                                        </label>
                                        <div className="flex items-center">
                                            <field.icon className="w-4 h-4 mr-2 text-gray-500" />
                                            <input
                                                type="text"
                                                id={field.name}
                                                name={field.name}
                                                value={doctorInfo}
                                                readOnly={!isEditing}
                                                className={`w-full px-3 py-2 border rounded-md ${
                                                    !isEditing ? 'bg-gray-50' : 'focus:ring-2 focus:ring-blue-500'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfile;
