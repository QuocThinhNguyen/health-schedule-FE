import { useEffect, useState, useContext } from 'react';
import Introduce from './Introduce';
import ListClinic from './ListClinic/ListClinic';
import ListDoctor from './ListDoctor/ListDoctor';
import SearchInput from './Search/Search';
import Statistics from './Statistics';
import News from './News/News';
import ListService from './ListService/ListService';
import ListDoctorRecommended from './DoctorRecommended/ListDoctorRecommended';
import ListVideo from './ListVideo/ListVideo';
import { UserContext } from '~/context/UserContext';
import FormRecommendationDoctor from './DoctorRecommended/FormRecommendationDoctor';

function Home() {
    const images = ['home_image1.jpg', 'home_image2.jpg', 'home_image3.jpg', 'home_image4.jpg'];

    //Slider
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { user } = useContext(UserContext);

    const [showRecommendationForm, setShowRecommendationForm] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [hasSubmittedRecommendation, setHasSubmittedRecommendation] = useState(false);

    // useEffect(() => {
    //     if (user.auth) {
    //         setShowRecommendationForm(true);
    //     }
    // }, [user.auth]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevClinicIndex) => (prevClinicIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleChangeImage = (index) => {
        setCurrentImageIndex(index);
    };

    const handleCloseForm = () => {
        setShowRecommendationForm(false);
        setHasSubmittedRecommendation(true);
    };

    useEffect(() => {
        if (user?.auth && user?.userId) {
            const key = `recommendFormDate_${user.userId}`;
            const lastShownStr = localStorage.getItem(key);

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            if (!lastShownStr) {
                setShowRecommendationForm(true);
                localStorage.setItem(key, todayStr);
            } else {
                const lastShown = new Date(lastShownStr);
                const diffInDays = Math.floor((today - lastShown) / (1000 * 60 * 60 * 24));
                if (diffInDays >= 3) {
                    setShowRecommendationForm(true);
                    setHasSubmittedRecommendation(true);
                    localStorage.setItem(key, todayStr);
                } else {
                    const savedSymptoms = localStorage.getItem(`selectedSymptoms_${user.userId}`);
                    if (savedSymptoms) {
                        setSelectedSymptoms(JSON.parse(savedSymptoms));
                    }
                    setHasSubmittedRecommendation(true);
                }
            }
        }
    }, [user?.auth, user?.userId]);

    const handleRecommendDoctor = (symptoms) => {
        setSelectedSymptoms(symptoms);
        setShowRecommendationForm(false);
        setHasSubmittedRecommendation(true);

        if (user?.userId) {
            localStorage.setItem(`selectedSymptoms_${user.userId}`, JSON.stringify(symptoms));
        }
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
            {user.auth && hasSubmittedRecommendation && <ListDoctorRecommended symptoms={selectedSymptoms} />}

            {showRecommendationForm && (
                <FormRecommendationDoctor onClose={handleCloseForm} onRecommend={handleRecommendDoctor} />
            )}

            {/* Dich vu */}
            <ListService />

            {/* Video */}
            <ListVideo />
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
