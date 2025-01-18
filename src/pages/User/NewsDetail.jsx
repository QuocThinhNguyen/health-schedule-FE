import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { MdOutlineDateRange } from 'react-icons/md';
import { useLocation, useParams } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';
import formatDate from '~/utils/formatDate';
import './CSS/NewsCss.css';

function NewsDetail() {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;

    const [post, setPost] = useState({});

    const { title } = useParams();

    const extractIdFromSlug = (slug) => {
        const match = slug.match(/-(\d+)$/); // Tìm số cuối cùng sau dấu '-'
        return match ? parseInt(match[1], 10) : null;
    };

    const postId = extractIdFromSlug(title);

    useEffect(() => {
        if (postId) {
            const getPostById = async () => {
                try {
                    const response = await axiosClient.get(`/post/${postId}`);
                    if (response.status === 200) {
                        setPost(response.data);
                    } else {
                        console.error('No post are found:', response.message);
                        setPost({});
                    }
                } catch (error) {
                    console.error('Failed to get post:', error);
                    setPost({});
                }
            };
            getPostById();
        }
    }, [postId]);
    console.log('post:', post);

    return (
        <div className="max-w-[1110px] mx-auto min-h-screen bg-white my-28">
            {/* title */}
            <div className="text-6xl font-medium text-[#003553]">{post.title}</div>
            <div className="flex items-center text-3xl text-[#858585] font-normal gap-2 mt-8">
                <MdOutlineDateRange />
                <span>{formatDate(post.updateAt)}</span>
                <span> - </span>
                <span>{post.userId && post.userId.fullname}</span>
            </div>
            <div className="max-w-7xl mt-8">
                <div className="w-full h-[400px] max-h-[400px]">
                    <img
                        src={`${IMAGE_URL}${post.image}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                {/* <div className="mt-12" dangerouslySetInnerHTML={{ __html: post.content }}></div> */}

                <div className="mt-12 news-content">{post.content ? parse(post.content) : 'Nội dung không có sẵn'}</div>
            </div>
        </div>
    );
}

export default NewsDetail;
