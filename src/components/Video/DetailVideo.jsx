import React, { useState, useEffect, useContext, useRef } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { NavLink, useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    Music2,
    Volume2,
    VolumeX,
    Maximize2,
    X,
    MoreVertical,
    Search,
    ChevronDown,
    ChevronUp,
    Play,
} from 'lucide-react';
import e from 'cors';
import VideoItem from '~/components/Video/VideoItem';
import { toast } from 'react-toastify';
import { set } from 'date-fns';

function DetailVideo() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);
    const [volume, setVolume] = useState(1);
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [videos, setVideos] = useState([]);
    const [searchParams] = useSearchParams();
    const idDoctor = searchParams.get('idDoctor');
    const idVideo = searchParams.get('idVideo');

    const [currentIndex, setCurrentIndex] = useState();
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [detailVideo, setDetailVideo] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState([]);

    const togglePlay = () => {
        console.log('Play');
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMutedState = !isMuted;
            videoRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
            setVolume(newMutedState ? 0 : 1); // Cập nhật volume để UI hiển thị đúng
            console.log('Mute:', newMutedState);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        console.log(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
        setVolume(newVolume);
    };

    const [activeTab, setActiveTab] = useState('comments');

    const tabs = [
        { id: 'comments', label: 'Bình luận' },
        { id: 'videos', label: 'Video của bác sĩ' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/video/${idDoctor}`);
                // console.log('response check', response);
                if (response.status === 200) {
                    setVideos(response.data);
                }
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };
        fetchData();
    }, []);

    const videoIds = videos.map((video) => video.videoId);
    console.log('data video:', videoIds);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axiosInstance.get(`/video/detail/${idVideo}`);
                if (response.status === 200) {
                    setDetailVideo(response.data);
                }
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };
        fetchVideo();
    }, [idVideo]);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${idDoctor}`);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info: ', error.message);
            }
        };
        fetchDoctorInfo();
    }, []);

    const copyToClipboard = () => {
        const url = `http://localhost:5173/video?idVideo=${idVideo}&&idDoctor=${idDoctor}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success('Đã sao chép liên kết');
            })
            .catch((err) => {
                toast.error('Sao chép liên kết thất bại');
            });
    };

    const handleVideoClick = (videoId) => {
        console.log('ID video được click:', videoId);
        // Xử lý logic khi click vào video (mở video, copy URL, v.v.)
    };

    const previousPage = () => {
        navigate(`/bac-si/get?id=${idDoctor}`);
        console.log('Previous page');
    };

    return (
        <div className="w-full flex bg-white h-fit">
            {/* Cột bên trái */}
            <div className="w-3/5 h-fit bg-black items-center justify-center flex">
                <div className="relative px-40 cursor-pointer" onClick={togglePlay}>
                    <div
                        className="absolute top-0 left-0 z-10 flex items-center justify-between p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className=" border rounded-full bg-[#3a3a3a] border-none p-1 hover:bg-[#2a2a2a]"
                            onClick={(e) => {
                                e.stopPropagation();
                                previousPage();
                            }}
                        >
                            <X className="w-6 h-6 font-bold text-white" />
                        </button>
                    </div>
                    <div
                        className="absolute right-0 top-1/3 z-10 flex flex-col gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="border rounded-full bg-[#3a3a3a] border-none p-2 hover:bg-[#2a2a2a]">
                            <ChevronUp className="w-6 h-6 text-white" />
                        </button>
                        <button className="border rounded-full bg-[#3a3a3a] border-none p-2 hover:bg-[#2a2a2a]">
                            <ChevronDown className="w-6 h-6 text-white" />
                        </button>
                    </div>
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <button>
                                <img src="/play.png" className="w-10 h-10" />
                            </button>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        src={`${IMAGE_URL}${detailVideo.videoName}`}
                        className="w-full h-[95vh] object-cover"
                        loop
                        playsInline
                    />

                    {/* Nút âm lượng + Thanh trượt */}
                    <div
                        className="absolute bottom-8 right-0 flex flex-col items-center bg-black/60 rounded-lg"
                        onClick={(e) => e.stopPropagation()} // Ngăn click ảnh hưởng tới togglePlay
                        onMouseEnter={() => setShowVolumeControl(true)}
                        onMouseLeave={() => setShowVolumeControl(false)}
                    >
                        {/* Thanh trượt âm lượng */}
                        {showVolumeControl && (
                            <div className="absolute bottom-full mb-12 flex flex-col items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1  rounded-lg appearance-none cursor-pointer rotate-[-90deg]"
                                />
                            </div>
                        )}

                        {/* Biểu tượng loa */}
                        <button
                            className="border rounded-full bg-[#3a3a3a] border-none p-2 hover:bg-[#2a2a2a]"
                            onClick={toggleMute}
                        >
                            {volume === 0 ? (
                                <img src="/volume-mute.png" className="w-6 h-6" />
                            ) : (
                                <img src="/volume.png" className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Cột bên phải */}
            <div className="w-2/5 pt-2 px-2">
                <div className="p-2">
                    <div className="border border-none bg-[#f8f8f8] rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-start gap-2">
                            <img
                                src={`${IMAGE_URL}${doctorInfo.image}`}
                                alt="avatar"
                                className="rounded-full w-10 h-10 object-cover"
                            />
                            <div className="w-full">
                                <div className="flex items-center justify-start w-full">
                                    <div className="text-lg font-bold">
                                        {doctorInfo.position} {doctorInfo.fullname}
                                    </div>
                                    <span className="text-sm ml-auto text-blue-700">
                                        {new Date(detailVideo.createAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>

                                <div className="items-center justify-start flex gap-2">
                                    <div className="text-sm uppercase">{doctorInfo.clinicName}</div>
                                    <div className="text-sm">•</div>
                                    <div className="text-sm uppercase">{doctorInfo.specialtyName}</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-base font-normal">{detailVideo.videoTitle}</div>
                    </div>
                    <div className="flex items-center justify-start gap-10 p-4">
                        <div className="flex items-center justify-start gap-2">
                            <button className="bg-[#f1f1f2] p-2 rounded-full">
                                <Heart className="w-5 h-5 text-black" />
                            </button>
                            <span className="text-xs font-bold">5256</span>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                            <button className="bg-[#f1f1f2] p-2 rounded-full">
                                <MessageCircle className="w-5 h-5 text-black" />
                            </button>
                            <span className="text-xs font-bold">1010</span>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                            <button className="bg-[#f1f1f2] p-2 rounded-full">
                                <Bookmark className="w-5 h-5" />
                            </button>
                            <span className="text-xs font-bold">500</span>
                        </div>
                    </div>
                    <div className="items-center justify-start flex gap-2 px-4 py-1 w-full bg-[#f1f1f2] rounded-lg">
                        <div className="truncate max-w-80 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                            {`http://localhost:5173/video?idVideo=${idVideo}&&idDoctor=${idDoctor}`}
                        </div>
                        <div className="text-sm font-bold ml-auto cursor-pointer" onClick={copyToClipboard}>
                            Sao chép liên kết
                        </div>
                    </div>

                    <div className="flex justify-center border-b pt-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-base text-[#737373] font-semibold px-4 relative flex justify-center items-center w-full ${
                                    activeTab === tab.id
                                        ? 'text-black font-bold'
                                        : 'text-[#959fa5] font-semibold hover:text-black'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-[-0.5px] left-1/2 transform -translate-x-1/2 right-0 h-0.5 bg-black mt-10" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-y-auto h-[280px]">
                        {activeTab === 'comments' && (
                            <div className="pt-4 px-4">
                                <div className="overflow-y-auto">
                                    <div className="flex items-center justify-start gap-2">
                                        <img src="/mail.png" alt="avatar" className="w-10 h-10 rounded-full border-2" />
                                        <div className="w-full">
                                            <div className="font-semibold text-sm">Nguyễn Thị Hương</div>
                                            <div className="items-center justify-start flex w-full">
                                                <div className="text-base max-w-80">
                                                    em ho bữa giờ không hết, uống thuốc quài không đỡ càng ho nhiều hơn
                                                </div>
                                                <div className="flex flex-col items-center ml-auto">
                                                    <Heart className="w-5 h-5 text-black " />
                                                    <span>1</span>
                                                </div>
                                            </div>
                                            <span className="text-[#9fa0a5] text-sm mr-2">2025-01-05</span>
                                            <span className="text-[#9fa0a5] text-sm cursor-pointer">Trả lời</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start gap-2 pl-10 mt-2">
                                        <img src="/mail.png" alt="avatar" className="w-8 h-8 rounded-full border-2" />
                                        <div className="w-full">
                                            <div className="flex items-center justify-start gap-1">
                                                <div className="font-semibold text-sm">Phạm Duy Kiên</div>
                                                <div>·</div>
                                                <div className="font-semibold text-sm text-[#FE2C55]">Bác sĩ</div>
                                            </div>

                                            <div className="items-center justify-start flex w-full">
                                                <div className="text-base max-w-80">
                                                    Bạn nên đến bệnh viện để được tư vấn cụ thể hơn
                                                </div>
                                                <div className="flex flex-col items-center ml-auto">
                                                    <Heart className="w-5 h-5 text-black " />
                                                    <span>1</span>
                                                </div>
                                            </div>
                                            <span className="text-[#9fa0a5] text-sm mr-2">2025-01-06</span>
                                            <span className="text-[#9fa0a5] text-sm cursor-pointer">Trả lời</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t px-4 pt-2 bottom-0">
                                    <input
                                        type="text"
                                        placeholder="Viết bình luận"
                                        className="w-full border-none bg-[#f1f1f2] rounded-lg p-2 outline-none "
                                    />
                                </div>
                            </div>
                        )}
                        {activeTab === 'videos' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                                    {videos.map((video) => (
                                        <VideoItem key={video.videoId} data={video} onClick={handleVideoClick} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailVideo;
