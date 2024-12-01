import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Send, Calendar, Building, Info, Phone, Mail } from 'lucide-react';
import { axiosInstance } from '~/api/apiRequest';
import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';

function ClinicInfo() {
    const [clinicData, setClinicData] = useState([]); // Trạng thái lưu dữ liệu từ API
    const { state } = useLocation();

    const navigate = useNavigate();

    console.log('STATE', state);
    console.log('clinicData:', clinicData);

    useEffect(() => {
        const fetchClinicInfo = async () => {
            try {
                const response = await axiosInstance.get(`/clinic/${state.clinicId}`);
                console.log('response:', response);
                if (response.status === 200) {
                    setClinicData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clinic:', error.message);
            }
        };

        fetchClinicInfo();
    }, []);

    const handleGetSpecialty = (clinicId, clinicName) => {
        console.log('clinicId:', clinicId);
        navigate(`/benh-vien/chuyen-khoa`, {
            state: { clinicId: clinicId, clinicName: clinicName },
        });
    };
    return (
        <div className="min-h-screen bg-white mt-20">
            {/* Header */}
            <header className="bg-white shadow-sm h-[300px] relative px-4 sm:px-7">
                <img
                    src="https://cdn.bookingcare.vn/fo/2021/09/14/095119-benh-vien-cho-ray-h1.jpg"
                    alt="Clinic Banner"
                    className="absolute left-0 right-0 w-full h-[300px] z-0 object-cover"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-80 z-10 relative"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-48 z-10 relative bg-white opacity-80 shadow">
                    <div className="flex items-center justify-between h-full ">
                        <div className="flex items-center gap-3 h-full">
                            <img
                                src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${clinicData.image}`}
                                alt="logo clinic"
                                className="h-32 w-32 rounded-full"
                            />

                            <div>
                                <h1 className="text-4xl font-bold">{clinicData.name}</h1>
                                <p className="text-xl text-gray-600">{clinicData.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
                {/* Information Sections */}
                <div className="space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="text-xl">
                            EasyMed là Nền tảng Y tế chăm sóc sức khỏe toàn diện hàng đầu Việt Nam kết nối người dùng
                            với trên 200 bệnh viện - phòng khám uy tín, hơn 1,500 bác sĩ chuyên khoa giỏi và hàng nghìn
                            dịch vụ, sản phẩm y tế chất lượng cao.
                        </p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <p className="text-xl mb-4">
                            Từ nay, người bệnh có thể đặt lịch tại Khu khám bệnh theo yêu cầu thông qua hệ thống đặt
                            khám EasyMed.
                        </p>
                        <ul className="space-y-2 text-xl">
                            <li className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                Được lựa chọn các giáo sư, tiến sĩ, bác sĩ chuyên khoa giàu kinh nghiệm
                            </li>
                            <li className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                Hỗ trợ đặt khám trực tuyến trước khi đi khám (miễn phí đặt lịch)
                            </li>
                            <li className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                Giảm thời gian chờ đợi khi làm thủ tục khám và ưu tiên khám trước
                            </li>
                            <li className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                Nhận được hướng dẫn chi tiết sau khi đặt lịch
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-xl">
                        <h3 className="text-xl font-semibold mb-4">GIỚI THIỆU</h3>
                        <div className="space-y-4 ">
                            <div>
                                <h4 className="font-medium mb-2 flex items-center">
                                    <MapPin className="mr-2" size={15} />
                                    Địa chỉ:
                                </h4>
                                <p className="text-gray-600">{clinicData.address}</p>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 flex items-center">
                                    <Clock className="mr-2" size={15} />
                                    Thời gian làm việc:
                                </h4>
                                <p className="text-gray-600">Thứ 2 đến thứ 7</p>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 flex items-center">
                                    <Phone className="mr-2" size={15} />
                                    Hỗ trợ đặt khám:
                                </h4>
                                <p className="text-gray-600">{clinicData.phoneNumber}</p>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 flex items-center">
                                    <Mail className="mr-2" size={15} />
                                    Email liên hệ:
                                </h4>
                                <p className="text-gray-600">{clinicData.email}</p>
                            </div>

                            <div className="doctor-description">
                                {clinicData.description ? parse(clinicData.description) : 'Mô tả không có sẵn'}
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto py-3">
                        <button
                            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium border hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors fixed bottom-0 left-0 right-0"
                            onClick={() => handleGetSpecialty(clinicData.clinicId, clinicData.name)}
                        >
                            Chọn Đặt Khám
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ClinicInfo;
