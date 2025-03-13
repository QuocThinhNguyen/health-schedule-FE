import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';

const AnimatedHeartButton = ({ likes, videoId, checkLike, userId }) => {
    const [liked, setLiked] = useState(checkLike);
    const [likeCount, setLikeCount] = useState(likes || 0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async () => {
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 700);

        try {
            const updatedLikes = liked ? likeCount - 1 : likeCount + 1;
            const response = await axiosInstance.put(`/video/${videoId}`, {
                likes: updatedLikes,
            });

            if (response.status === 200) {
                // toast.success('Cập nhật video thành công');
            } else {
                toast.error('Cập nhật video thất bại');
            }

            const checkLike = !liked;

            if (checkLike) {
                const responseLike = await axiosInstance.post(`/video/like/${videoId}/${userId}`);
                if (responseLike.status === 200) {
                    // toast.success('Like video thành công');
                } else {
                    toast.error('Like video thất bại');
                }
            } else {
                const responseLike = await axiosInstance.delete(`/video/like/${videoId}/${userId}`);
                if (responseLike.status === 200) {
                    // toast.success('Unlike video thành công');
                } else {
                    toast.error('Unlike video thất bại');
                }
            }
        } catch (error) {
            console.error('Failed to like video: ', error.message);
        }
    };

    useEffect(() => {
        setLikeCount(likes);
        // setLiked(false);
        setLiked(checkLike);
    }, [likes, checkLike]);
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleLike}
                className="relative bg-[#f1f1f2] p-[6px] rounded-full"
                aria-label={liked ? 'Unlike' : 'Like'}
            >
                <motion.div whileTap={{ scale: 0.8 }} className="relative z-10 flex items-center justify-center">
                    <Heart
                        className={`w-5 h-5 transition-colors ${
                            liked ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
                        }`}
                    />
                </motion.div>

                <AnimatePresence>
                    {isAnimating && liked && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: [0, 1, 0] }}
                            exit={{ scale: 1, opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0 z-0 flex items-center justify-center"
                        >
                            <Heart className="w-5 h-5 fill-red-500 stroke-red-500" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isAnimating && liked && (
                        <>
                            {[...Array(6)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 0,
                                        x: (index % 2 === 0 ? 1 : -1) * (Math.random() * 20),
                                        y: -20 - Math.random() * 20,
                                    }}
                                    transition={{
                                        duration: 0.7,
                                        ease: 'easeOut',
                                    }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                                >
                                    <div className="w-1 h-1 rounded-full bg-red-500" />
                                </motion.div>
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </button>

            <motion.span
                key={likeCount}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-medium text-gray-900"
            >
                {likeCount.toLocaleString()}
            </motion.span>
        </div>
    );
};

export default AnimatedHeartButton;
