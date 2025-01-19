import React, { useEffect, useState } from 'react';
import Introduce from './Introduce';
import ListClinic from './ListClinic/ListClinic';
import ListDoctor from './ListDoctor/ListDoctor';
import SearchInput from './Search/SearchInput';
import Statistics from './Statistics';
import News from './News/News';

function Home() {
    const images = [
        'https://pmc.bookingcare.vn/assets/anh/bookingcare-cover-4.jpg',
        'https://www.hopkinsmedicine.org/-/media/images/option3.jpg',
        'https://cdn.medpro.vn/prod-partner/92b6d682-4b5a-4c94-ac54-97a077c0c6c5-homepage_banner.webp',
        'https://cdn.youmed.vn/wp-content/themes/youmed/images/your-medical-booking.webp',
    ];

    //Slider
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevClinicIndex) => (prevClinicIndex + 1) % images.length);
        }, 4000); // Chuyển ảnh mỗi 4 giây
        return () => clearInterval(interval);
    }, [images.length]);

    const handleChangeImage = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="bg-[#F8F9FC]">
            <div className="w-full h-[450px]  relative overflow-hidden mt-14 pt-30">
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

            {/* Binh luan */}
            <Introduce />

            {/* Thong ke */}
            <Statistics />

            {/* Tin tuc */}
            <News />
        </div>
    );
}

export default Home;