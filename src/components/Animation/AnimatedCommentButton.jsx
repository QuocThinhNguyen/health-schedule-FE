import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { use } from 'react';

const AnimatedCommentButton = ({ totalComment }) => {
    const [commentCount, setCommentCount] = useState(totalComment || 0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 700);
        // In a real app, this would open the comment section or dialog
    };

    useEffect(() => {
        setCommentCount(totalComment);
    }, [totalComment]);

    return (
        <div className="flex items-center gap-2">
            <button onClick={handleClick} className="relative bg-[#f1f1f2] p-[6px] rounded-full" aria-label="Comment">
                <motion.div whileTap={{ scale: 0.8 }} className="relative z-10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 stroke-gray-600" />
                </motion.div>

                <AnimatePresence>
                    {isAnimating && (
                        <motion.div
                            initial={{ rotate: 0, opacity: 0 }}
                            animate={{ rotate: [0, -15, 15, -10, 10, 0], opacity: [0, 1, 0] }}
                            exit={{ rotate: 0, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 z-0 flex items-center justify-center"
                        >
                            <MessageCircle className="w-5 h-5 stroke-gray-600" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            <motion.span
                key={commentCount}
                initial={{ scale: 1 }}
                animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="font-medium text-gray-900"
            >
                {commentCount.toLocaleString()}
            </motion.span>
        </div>
    );
};

export default AnimatedCommentButton;
