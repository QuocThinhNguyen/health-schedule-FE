import { useEffect, useState, useContext } from 'react';
import Introduce from './Introduce';
import ListClinic from './ListClinic/ListClinic';
import ListDoctor from './ListDoctor/ListDoctor';
import SearchInput from './Search/Search';
import Statistics from './Statistics';
import News from './News/News';
import ListService from './ListService/ListService';
import ListDoctorRecommended from './DoctorRecommended/ListDoctorRecommended';
import { UserContext } from '~/context/UserContext';

function Home() {
    const images = ['home_image1.jpg', 'home_image2.jpg', 'home_image3.jpg', 'home_image4.jpg'];

    //Slider
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevClinicIndex) => (prevClinicIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleChangeImage = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="bg-[#F8F9FC]">
            <div className="w-full h-[550px]  relative overflow-hidden mt-14 pt-30">
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
        </div>
    );
}

export default Home;
