import React, { useState, useEffect, useContext, useRef } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { NavLink, useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import {
    Heart,
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
    Pause,
    Edit,
    Pen,
} from 'lucide-react';
import e from 'cors';
import VideoItem from '~/components/Video/VideoItem';
import { toast } from 'react-toastify';
import { IoIosHeart } from 'react-icons/io';
import { BiSolidMessageRoundedDots } from 'react-icons/bi';
import { RxBookmarkFilled } from 'react-icons/rx';
import AnimatedHeartButton from '../Animation/AnimatedHeartButton';
import AnimatedBookmarkButton from '../Animation/AnimatedBookmarkButton';
import AnimatedCommentButton from '../Animation/AnimatedCommentButton';
import { motion } from 'framer-motion';
import { UserContext } from '~/context/UserContext';

function DetailVideo() {
    const { user } = useContext(UserContext);
    const userId = user.userId;
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
    const [checkDoctor, setCheckDoctor] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/user/${userId}`);
                if (response.status === 200) {
                    setCheckDoctor(response.data);
                }
            } catch (error) {
                console.error('Error fetching doctor info:', error);
            }
        };
        fetchData();
    }, [userId]);
    // console.log('Check type', typeof detailVideo.likes);

    const togglePlay = () => {
        // console.log('Play');
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
            // console.log('Mute:', newMutedState);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        // console.log(newVolume);
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
    // console.log('data video:', videoIds);
    // console.log('check id', idVideo);
    // console.log('type of id', typeof idVideo);
    // console.log('current index', videoIds.indexOf(Number(idVideo)));
    // console.log('videoId:', videoIds[0]);

    const handleNextVideo = () => {
        const currentIndex = videoIds.indexOf(Number(idVideo));
        const nextIndex = (currentIndex + 1) % videoIds.length; // Lặp lại từ đầu nếu đến cuối
        setIsPlaying(false);
        navigate(`/video?idVideo=${videoIds[nextIndex]}&&idDoctor=${idDoctor}`);
    };

    const handlePreviousVideo = () => {
        const currentIndex = videoIds.indexOf(Number(idVideo));
        const previousIndex = (currentIndex - 1 + videoIds.length) % videoIds.length; // Xử lý vòng lặp về cuối mảng nếu ở đầu
        setIsPlaying(false);
        navigate(`/video?idVideo=${videoIds[previousIndex]}&&idDoctor=${idDoctor}`);
    };

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axiosInstance.get(`/video/detail/${idVideo}`);
                if (response.status === 200) {
                    setDetailVideo(response.data);
                    setTitle(response.data.videoTitle);
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

    const [showControls, setShowControls] = useState(true);
    const progressRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const controlsTimeoutRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (!isDragging) {
                setProgress((video.currentTime / video.duration) * 100);
                setCurrentTime(video.currentTime);
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [isDragging]);

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 2000);
        };

        // window.addEventListener('mousemove', handleMouseMove);
        // return () => window.removeEventListener('mousemove', handleMouseMove);
        // Lắng nghe sự kiện **chỉ trong container**
        const videoContainer = videoRef.current?.parentElement;
        if (videoContainer) {
            videoContainer.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (videoContainer) {
                videoContainer.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isPlaying]);

    const handleProgressClick = (e) => {
        const progressBar = progressRef.current;
        if (progressBar && videoRef.current) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const time = percent * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setProgress(percent * 100);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const checkUserLikeVideo = async () => {
            try {
                const response = await axiosInstance.get(`/video/like/${idVideo}/${userId}`);
                if (response.status === 200) {
                    setLiked(response.data);
                }
            } catch (error) {
                console.error('Error checking user like video:', error);
            }
        };
        checkUserLikeVideo();
    }, [idVideo, userId]);

    const [bookMark, setBookMark] = useState(false);
    const [totalBookMark, setTotalBookMark] = useState(0);

    useEffect(() => {
        const checkUserBookmarkVideo = async () => {
            try {
                const response = await axiosInstance.get(`/bookmark/${idVideo}/${userId}`);
                if (response.status === 200) {
                    setBookMark(response.data);
                }
            } catch (error) {
                console.error('Error checking user like video:', error);
            }
        };
        checkUserBookmarkVideo();
    }, [idVideo, userId]);

    console.log('Check bookmark:', bookMark);
    useEffect(() => {
        const fetchBookmark = async () => {
            try {
                const response = await axiosInstance.get(`/bookmark/video/${idVideo}`);
                if (response.status === 200) {
                    setTotalBookMark(response.data);
                }
            } catch (error) {
                console.error('Error fetching bookmark:', error);
            }
        };
        fetchBookmark();
    }, [idVideo]);

    const [comment, getComment] = useState('');

    // console.log('Check comment:', comment);
    const currentDate = new Date().toISOString().slice(0, 10);

    const sendComment = async () => {
        try {
            const response = await axiosInstance.post(`/comment`, {
                userId: userId,
                videoId: idVideo,
                comment: comment,
                createdAt: currentDate,
            });
            if (response.status === 200) {
                // console.log('Send comment success:', response);
                toast.success('Bạn đã bình luận thành công');
                getComment('');
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        }
    };

    const [comments, setComments] = useState([]);
    // console.log('Check comments:', comments);
    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await axiosInstance.get(`/comment/all/${idVideo}`);
                if (response.status === 200) {
                    setComments(response.data);
                }
            } catch (error) {
                console.error('Error fetching comment:', error);
            }
        };
        fetchComment();
    });

    const [replyingTo, setReplyingTo] = useState(null); // Lưu commentId đang trả lời
    const [replyText, setReplyText] = useState(''); // Nội dung trả lời

    const handleReplyClick = (commentId) => {
        if (!userId) {
            toast.info('Bạn cần đăng nhập để sử dụng chức năng này');
            return;
        }
        setReplyingTo(replyingTo === commentId ? null : commentId); // Nếu đã mở thì đóng
        setReplyText(''); // Reset nội dung
    };

    const sendReply = async (parentId) => {
        if (!userId) {
            toast.info('Bạn cần đăng nhập để sử dụng chức năng này');
            return;
        }
        if (!replyText.trim()) return; // Không gửi nếu input rỗng

        // console.log(`Gửi phản hồi cho commentId ${parentId}:`, replyText);

        try {
            const response = await axiosInstance.post(`/comment`, {
                userId: userId,
                videoId: idVideo,
                comment: replyText,
                createdAt: currentDate,
                parentId: parentId,
            });
            if (response.status === 200) {
                // console.log('Send comment success:', response);
                toast.success('Bạn đã bình luận thành công');
                getComment('');
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        }

        // Gửi API hoặc xử lý logic thêm bình luận tại đây
        setReplyingTo(null); // Ẩn ô nhập sau khi gửi
        setReplyText('');
    };

    const closeReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const [checkLiked, setCheckLiked] = useState(false);
    const [numberLike, setNumberLike] = useState(0);

    const handleLikeClick = () => {
        if (checkLiked) {
            setNumberLike(checkLiked - 1); // Nếu đã like thì bỏ like
        } else {
            setNumberLike(checkLiked + 1); // Nếu chưa like thì tăng số lượt thích
        }
        setCheckLiked(!liked);
    };

    const [totalComment, setTotalComment] = useState(0);

    useEffect(() => {
        const fetchTotalComment = async () => {
            try {
                const response = await axiosInstance.get(`/comment/${idVideo}`);
                if (response.status === 200) {
                    setTotalComment(response.data);
                }
            } catch (error) {
                console.error('Error fetching total comment:', error);
            }
        };
        fetchTotalComment();
    });

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.put(`/video/${idVideo}`, {
                videoTitle: title,
            });

            if (response.status === 200) {
                toast.success('Cập nhật video thành công');
                setIsEditing(false);
            } else {
                toast.error('Cập nhật video thất bại');
            }
        } catch (error) {
            console.error('Error update video data:', error);
        }
    };

    return (
        <div className="w-full flex bg-white h-screen-minus-20">
            {/* Cột bên trái */}
            <div className="flex-1 h-full bg-black items-center justify-center flex">
                <div className="relative px-40 cursor-pointer w-full h-full" onClick={togglePlay}>
                    <div
                        className="absolute top-4 left-4 z-10 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className=" border rounded-full bg-[#3a3a3a] border-none p-1 hover:bg-[#2a2a2a]"
                            onClick={previousPage}
                        >
                            <X className="w-6 h-6 font-bold text-white" />
                        </button>
                    </div>
                    <div
                        className="absolute right-4 top-1/3 z-10 flex flex-col gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="border rounded-full bg-[#3a3a3a] border-none p-2 hover:bg-[#2a2a2a]"
                            onClick={handlePreviousVideo}
                        >
                            <ChevronUp className="w-6 h-6 text-white" />
                        </button>
                        <button
                            className="border rounded-full bg-[#3a3a3a] border-none p-2 hover:bg-[#2a2a2a]"
                            onClick={handleNextVideo}
                        >
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

                    <div className="w-full h-full flex items-center justify-center">
                        <video
                            ref={videoRef}
                            src={`${IMAGE_URL}${detailVideo.videoName}`}
                            className="w-ful h-full object-contain"
                            loop
                            playsInline
                        />
                        {/* Controls Overlay */}
                        <div
                            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300 ${
                                showControls ? 'opacity-100' : 'opacity-0'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Progress Bar */}
                            <div
                                ref={progressRef}
                                className="relative h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
                                onClick={handleProgressClick}
                            >
                                <motion.div
                                    className="absolute left-0 top-0 bottom-0 bg-white rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Play/Pause Button */}
                                    <button onClick={togglePlay}>
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6 text-white" />
                                        ) : (
                                            <Play className="w-6 h-6 text-white" />
                                        )}
                                    </button>

                                    {/* Time Display */}
                                    <div className="text-white text-sm">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>

                                {/* Fullscreen Button */}
                            </div>
                        </div>
                    </div>

                    {/* Nút âm lượng + Thanh trượt */}
                    <div
                        className="absolute bottom-2 right-4 flex flex-col items-center bg-black/60 rounded-lg"
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
            <div className="w-[544px] h-full flex flex-col relative ">
                <div className="flex-grow flex flex-col overflow-y-scroll">
                    <div className="ml-5 mt-6 border border-none bg-[#16182308] rounded-xl p-4 space-y-2">
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
                        <div className="flex items-center justify-start gap-2">
                            {isEditing ? (
                                <div className="flex items-center justify-start gap-2 w-full">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md outline-none"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        autoFocus
                                    />
                                    <button className="ml-auto" onClick={handleSave}>
                                        <img src="/save.png" className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-start gap-2 w-full">
                                    <div className="text-base font-normal">{title}</div>
                                    {checkDoctor.roleId === 'R2' && (
                                        <button className="ml-auto" onClick={handleEdit}>
                                            <img src="/edit.png" className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-start gap-5 ml-5 p-4">
                        <div className="flex items-center justify-start gap-2">
                            {detailVideo && detailVideo.likes !== undefined && (
                                <AnimatedHeartButton
                                    likes={detailVideo.likes}
                                    videoId={detailVideo.videoId}
                                    checkLike={liked}
                                    userId={userId}
                                />
                            )}

                            {/* <span className="text-xs font-bold text-[#161823BF]">5256</span> */}
                        </div>
                        <div className="flex items-center justify-start gap-2">
                            <AnimatedCommentButton totalComment={totalComment} />
                            {/* <span className="text-xs font-bold text-[#161823BF]">1010</span> */}
                        </div>
                        <div className="flex items-center justify-start gap-2">
                            <AnimatedBookmarkButton
                                totalBookMark={totalBookMark}
                                checkBookmark={bookMark}
                                videoId={detailVideo.videoId}
                                userId={userId}
                            />
                            {/* <span className="text-xs font-bold text-[#161823BF]">500</span> */}
                        </div>
                    </div>

                    <div className="items-center justify-start flex mx-8 bg-[#1618230f] rounded-lg border">
                        <div className="truncate text-sm pl-3 pb-2 pt-[6px]">
                            {`http://localhost:5173/video?idVideo=${idVideo}&&idDoctor=${idDoctor}`}
                        </div>
                        <div
                            className="px-4 pb-2 pt-[6px] text-sm font-bold cursor-pointer whitespace-nowrap"
                            onClick={copyToClipboard}
                        >
                            Sao chép liên kết
                        </div>
                    </div>
                    <div>
                        <div className="sticky top-0 z-10 bg-white flex justify-center border-b pt-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-2 text-base text-[#737373] font-semibold px-4 relative flex justify-center items-center w-full ${
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

                        <div className="w-full flex-grow overflow-y-hidden">
                            {activeTab === 'comments' && (
                                // nội dung bình luận
                                <div className="mt-4 mx-8 relative flex flex-col">
                                    {comments.map((comment) => (
                                        <div key={comment._id}>
                                            <div>
                                                <div className="flex items-start justify-start gap-2 mb-2">
                                                    <div className="flex items-start justify-center gap-2">
                                                        <img
                                                            src={`${IMAGE_URL}${comment.userId.image}`}
                                                            alt="avatar"
                                                            className="w-10 h-10 rounded-full border-2"
                                                        />
                                                        <div className="w-full">
                                                            <div className="font-semibold text-sm">
                                                                {comment.userId.fullname}
                                                            </div>
                                                            <div className="items-center justify-start flex w-full">
                                                                <div className="text-base max-w-80">
                                                                    {comment.comment}
                                                                </div>
                                                            </div>
                                                            <span className="text-[#9fa0a5] text-sm mr-2">
                                                                {new Date(comment.createdAt).toLocaleDateString(
                                                                    'vi-VN',
                                                                )}
                                                            </span>
                                                            <span
                                                                className="text-[#9fa0a5] text-sm cursor-pointer"
                                                                onClick={() => handleReplyClick(comment.commentId)}
                                                            >
                                                                Trả lời
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center ml-auto">
                                                        <Heart
                                                            className={`w-5 h-5  cursor-pointer ${
                                                                checkLiked ? 'text-[#FE2C55]' : 'text-black'
                                                            }`}
                                                            onClick={handleLikeClick}
                                                        />
                                                        <span>1</span>
                                                    </div>
                                                </div>
                                                {/* Input nhập bình luận khi bấm trả lời */}
                                                {replyingTo === comment.commentId && (
                                                    <div className="w-full flex items-center justify-center gap-3 mt-2 mb-2 pl-12">
                                                        <input
                                                            type="text"
                                                            placeholder="Thêm câu trả lời..."
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            className="flex-1 border bg-[#f1f1f2] rounded-lg p-2 h-10 outline-none"
                                                        />
                                                        <div
                                                            className={`cursor-pointer ${
                                                                replyText ? 'text-[#FE2C55]' : 'text-gray-400'
                                                            } text-sm font-semibold`}
                                                            onClick={() => sendReply(comment.commentId)}
                                                        >
                                                            Đăng
                                                        </div>
                                                        <button onClick={closeReply}>
                                                            <X className="w-5 h-5 font-medium text-black" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {comment.replies.length > 0 && (
                                                <div>
                                                    {comment.replies.map((reply) => (
                                                        <div>
                                                            <div className="flex items-start justify-start gap-2 w-full pl-10 mb-2">
                                                                <div
                                                                    key={reply._id}
                                                                    className="flex items-start justify-start gap-2 w-full"
                                                                >
                                                                    <img
                                                                        src={`${IMAGE_URL}${reply.userId.image}`}
                                                                        alt="avatar"
                                                                        className="w-8 h-8 rounded-full border-2"
                                                                    />
                                                                    <div className="w-full">
                                                                        <div className="flex items-center justify-start gap-1">
                                                                            <div className="font-semibold text-sm">
                                                                                {reply.userId.fullname}
                                                                            </div>
                                                                            {reply.userId.roleId === 'R2' && (
                                                                                <div className="flex items-center gap-1 justify-center">
                                                                                    <div>·</div>
                                                                                    <div className="font-semibold text-sm text-[#FE2C55]">
                                                                                        Bác sĩ
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="items-center justify-start flex w-full">
                                                                            <div className="text-base max-w-80">
                                                                                {reply.comment}
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-[#9fa0a5] text-sm mr-2">
                                                                            {new Date(
                                                                                reply.createdAt,
                                                                            ).toLocaleDateString('vi-VN')}
                                                                        </span>
                                                                        <span
                                                                            className="text-[#9fa0a5] text-sm cursor-pointer"
                                                                            onClick={() =>
                                                                                handleReplyClick(reply.commentId)
                                                                            }
                                                                        >
                                                                            Trả lời
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-center ml-auto">
                                                                    <Heart className="w-5 h-5 text-black " />
                                                                    <span>1</span>
                                                                </div>
                                                            </div>
                                                            {/* Input nhập bình luận khi bấm trả lời */}
                                                            {replyingTo === reply.commentId && (
                                                                <div className="w-full flex items-center justify-center gap-3 mt-2 mb-2 pl-20">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Thêm câu trả lời..."
                                                                        value={replyText}
                                                                        onChange={(e) => setReplyText(e.target.value)}
                                                                        className="flex-1 border bg-[#f1f1f2] rounded-lg p-2 h-10 outline-none"
                                                                    />
                                                                    <div
                                                                        className={`cursor-pointer ${
                                                                            replyText
                                                                                ? 'text-[#FE2C55]'
                                                                                : 'text-gray-400'
                                                                        } text-sm font-semibold`}
                                                                        onClick={() => sendReply(comment.commentId)}
                                                                    >
                                                                        Đăng
                                                                    </div>
                                                                    <button onClick={closeReply}>
                                                                        <X className="w-5 h-5 font-medium text-black" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'videos' && (
                                <div className="overflow-y-auto h-full">
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
                {activeTab === 'comments' && (
                    <div className="bg-white bottom-0 left-0 right-0 z-10 border-t px-6 py-5 flex">
                        <div className="w-full flex items-center justify-center gap-3">
                            <input
                                type="text"
                                placeholder="Thêm bình luận ..."
                                value={comment}
                                onChange={(e) => getComment(e.target.value)}
                                className="flex-1 border-none bg-[#f1f1f2] rounded-lg p-2 h-10 outline-none w-full"
                                disabled={!userId}
                            />
                            <div
                                className={`cursor-pointer ${
                                    comment ? 'text-[#FE2C55]' : 'text-gray-400'
                                } text-sm font-semibold`}
                                onClick={sendComment}
                            >
                                Đăng
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailVideo;
