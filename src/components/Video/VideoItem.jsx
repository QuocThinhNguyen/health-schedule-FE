import React, { useState, useEffect, useContext, useRef } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { NavLink, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';

function VideoItem(data) {
    console.log('Check data get:', data.data);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;

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
    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-[3/5] rounded-lg overflow-hidden cursor-pointer group"
        >
            <video
                ref={videoRef}
                src={`${IMAGE_URL}${data.data.videoName}`}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
            />
            {/* Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" /> */}

            <div className="absolute bottom-3 left-3 right-3 w-28">
                <h3 className="text-white text-sm font-medium line-clamp-2 drop-shadow-md">{data.data.videoTitle}</h3>
            </div>

            {/* Play Icon & View Count */}
            <div className="absolute bottom-3 right-3 flex items-center text-white">
                <img src="/play-button.png" alt="play" className="w-4 h-4" />
                <span className="ml-1 text-sm font-medium">{data.data.views}</span>
            </div>
        </div>
    );
}

export default VideoItem;
