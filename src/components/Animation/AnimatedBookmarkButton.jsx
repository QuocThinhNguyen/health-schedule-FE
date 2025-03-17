import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';

const AnimatedBookmarkButton = ({ totalBookMark, checkBookmark, videoId, userId }) => {
    const [saved, setSaved] = useState(checkBookmark);
    const [saveCount, setSaveCount] = useState(totalBookMark || 0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setSaveCount(totalBookMark);
        setSaved(checkBookmark);
    }, [totalBookMark, checkBookmark]);

    const handleSave = async () => {
        if (!userId) {
            toast.info('Bạn cần đăng nhập để sử dụng chức năng này');
            return;
        }
        setSaved(!saved);
        setSaveCount((prev) => (saved ? prev - 1 : prev + 1));
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 700);

        try {
            const checkBookmark = !saved;
            console.log('checkBookmark:', checkBookmark);
            if (checkBookmark) {
                const responseBookMark = await axiosInstance.post(`/bookmark/${videoId}/${userId}`);
                if (responseBookMark.status === 200) {
                    // toast.success('Like video thành công');
                } else {
                    toast.error('Bookmark video thất bại');
                }
            } else {
                const responseBookMark = await axiosInstance.delete(`/bookmark/${videoId}/${userId}`);
                if (responseBookMark.status === 200) {
                    // toast.success('Unlike video thành công');
                } else {
                    toast.error('UnBookmark video thất bại');
                }
            }
        } catch (error) {
            console.error('Failed to save video: ', error.message);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSave}
                className="relative bg-[#f1f1f2] p-[6px] rounded-full"
                aria-label={saved ? 'Unsave' : 'Save'}
            >
                <motion.div whileTap={{ scale: 0.8 }} className="relative z-10 flex items-center justify-center">
                    <Bookmark
                        className={`w-5 h-5 transition-colors ${
                            saved ? 'fill-blue-500 stroke-blue-500' : 'stroke-gray-600'
                        }`}
                    />
                </motion.div>

                <AnimatePresence>
                    {isAnimating && saved && (
                        <motion.div
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: -10, opacity: [0, 1, 0] }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 z-0 flex items-center justify-center"
                        >
                            <Bookmark className="w-5 h-5 fill-blue-500 stroke-blue-500" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isAnimating && saved && (
                        <>
                            {[...Array(5)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 0,
                                        x: (index % 2 === 0 ? 1 : -1) * (Math.random() * 15),
                                        y: -15 - Math.random() * 15,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: 'easeOut',
                                    }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                                >
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                </motion.div>
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </button>

            <motion.span
                key={saveCount}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-medium text-gray-900"
            >
                {saveCount.toLocaleString()}
            </motion.span>
        </div>
    );
};

export default AnimatedBookmarkButton;
