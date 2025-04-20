import React, { useEffect, useState, useContext } from 'react';
import Introduce from './Introduce';
import ListClinic from './ListClinic/ListClinic';
import ListDoctor from './ListDoctor/ListDoctor';
import SearchInput from './Search/Search';
import Statistics from './Statistics';
import News from './News/News';
import ListService from './ListService/ListService';
import ListDoctorRecommended from './DoctorRecommended/ListDoctorRecommended';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';

function Home() {
    const images = [
        'https://pmc.bookingcare.vn/assets/anh/bookingcare-cover-4.jpg',
        'https://www.hopkinsmedicine.org/-/media/images/option3.jpg',
        'https://cdn.medpro.vn/prod-partner/92b6d682-4b5a-4c94-ac54-97a077c0c6c5-homepage_banner.webp',
        'https://cdn.youmed.vn/wp-content/themes/youmed/images/your-medical-booking.webp',
    ];

    //Slider
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevClinicIndex) => (prevClinicIndex + 1) % images.length);
        }, 4000); // Chuyển ảnh mỗi 4 giây
        return () => clearInterval(interval);
    }, [images.length]);

    const handleChangeImage = (index) => {
        setCurrentImageIndex(index);
    };

    const handleClick = () => {
        if (!user.auth) {
            setShowModal(true);
        } else {
            navigate('/chatbot');
        }
    };

    return (
        <div className="bg-[#F8F9FC]">
            <div className="w-full h-[550px]  relative overflow-hidden mt-14 pt-30">
                {/* Background image */}
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            currentImageIndex === index ? 'opacity-100 z-10' : 'opacity-0'
                        }`}
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            height: '100%',
                            width: '100%',
                        }}
                    ></div>
                ))}

                {/* Dấu chấm điều hướng */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => handleChangeImage(index)}
                            className={`w-2 h-2 rounded-full cursor-pointer ${
                                currentImageIndex === index ? 'bg-sky-500' : 'bg-white'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Tim kiem */}
            <SearchInput />

            {/* Benh vien */}
            <ListClinic />

            {/* Bac si */}
            <ListDoctor />

            {/* Gợi ý bác sĩ */}
            {user.auth && <ListDoctorRecommended />}

            {/* Dich vu */}
            <ListService />

            {/* Binh luan */}
            <Introduce />

            {/* Thong ke */}
            <Statistics />

            {/* Tin tuc */}
            <News />

            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    aria-label="Trợ lý AI"
                >
                    {/* Bot icon */}
                    <img src="/robot.png" alt="chatbot" className="w-8 h-8" />

                    {/* Pulse effect */}
                    <span className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></span>

                    {/* Tooltip */}
                    <div
                        className={`absolute bottom-full right-0 mb-2 whitespace-nowrap bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md text-sm font-medium transition-all duration-200 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                    >
                        Trợ lý AI
                        <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-white transform rotate-45"></div>
                    </div>
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in-up">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <img src="/account.png" alt="login" className="w-8 h-8" />

                                <h3 className="ml-3 text-lg font-medium text-gray-900">Yêu cầu đăng nhập</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-600">
                                Bạn cần đăng nhập để sử dụng chức năng Trợ lý AI. Vui lòng đăng nhập để tiếp tục.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                            <div
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium cursor-pointer"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập ngay
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
