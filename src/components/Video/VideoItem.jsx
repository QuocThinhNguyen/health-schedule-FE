import React, { useState, useEffect, useContext, useRef } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { NavLink, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';

function VideoItem(data) {
    console.log('Check data get:', data.data);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [isExpanded, setIsExpanded] = useState(false);
    const [doctorInfo, setDoctorInfo] = useState([]);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.log('Autoplay prevented:', err);
            });
        }
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        setIsHovered(false);
    };

    const toggleExpand = (e) => {
        e.stopPropagation(); // Ngăn sự kiện lan truyền
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${data.data.doctorId}`);
                console.log('2');
                console.log('Doctor info000: ', response);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info: ', error.message);
            }
        };
        fetchDoctorInfo();
    }, []);

    const getVideo = (videoId) => {
        console.log('get videoId:', videoId);
        navigate(`/video?idVideo=${videoId}&&idDoctor=${data.data.doctorId}`);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-[3/5] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => getVideo(data.data.videoId)}
        >
            <video
                ref={videoRef}
                src={`${IMAGE_URL}${data.data.videoName}`}
                className="w-full h-full object-cover"
                lazy="loading"
                muted
                playsInline
                preload="metadata"
            />
            {/* Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" /> */}

            <div className="absolute bottom-4 left-3 right-3">
                <div className="relative">
                    {/* <div className="flex items-center justify-center gap-2">
                        <img
                            src={`${IMAGE_URL}${doctorInfo.image}`} // Thay thế URL này bằng link ảnh thực tế của bác sĩ
                            alt="Doctor profile"
                            className="rounded-full w-8 h-8"
                        />
                        <div className="text-sm font-bold text-white">{doctorInfo.fullname}</div>
                    </div> */}
                    <div
                        className={`text-white text-sm font-medium drop-shadow-md transition-all duration-300 w-24
                            ${isExpanded ? '' : 'line-clamp-2'}`}
                    >
                        {data.data.videoTitle}
                    </div>

                    {/* Expand/Collapse Button - Chỉ hiển thị nếu title dài */}
                    {data.data.videoTitle.length > 25 && (
                        <button
                            onClick={toggleExpand}
                            className="absolute -bottom-4 right-6 text-white  rounded-full p-0.5 text-sm
                                        transition-colors z-10"
                        >
                            {isExpanded ? 'ẩn bớt' : 'thêm'}
                        </button>
                    )}
                </div>
            </div>

            {/* Play Icon & View Count */}
            <div className="absolute bottom-4 right-3 flex items-center text-white">
                <img src="/play-button.png" alt="play" className="w-4 h-4" />
                <span className="ml-1 text-sm font-medium">{data.data.views}</span>
            </div>
        </div>
    );
}

export default VideoItem;
