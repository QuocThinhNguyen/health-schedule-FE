import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowRight, MdOutlineDateRange } from 'react-icons/md';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';
import {formatDate} from '~/utils/formatDate';
import './NewsDetail.css';
import { FaAngleRight } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { formatTitleForUrl } from '~/utils/formatTitleForUrl';

function NewsDetail() {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [posts, setPosts] = useState([]);

    const { title } = useParams();
    const extractIdFromSlug = (slug) => {
        const match = slug.match(/-(\d+)$/);
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
            getAllPostsAndFilter();
        }
    }, [postId]);

    const getAllPostsAndFilter = async () => {
        try {
            const response = await axiosClient.get(`/post?&&limit=4`);
            if (response.status === 200) {
                setPosts(response.data);
            } else {
                console.error('No posts are found:', response.message);
                setPosts([]);
            }
        } catch (error) {
            console.error('Failed to get posts:', error);
            setPosts([]);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#e3f2ff]">
                <ul className=" max-w-6xl mx-auto  flex items-center gap-1 px-4 py-[10px] text-sm font-semibold">
                    <li>
                        <NavLink to="/">Trang chủ</NavLink>
                    </li>
                    <li>
                        <NavLink to="/tin-tuc" className="flex items-center">
                            <MdKeyboardArrowRight className="mt-1" />
                            Tin tức
                        </NavLink>
                    </li>
                    <li className="flex items-center cursor-pointer">
                        <MdKeyboardArrowRight className="mt-1" />
                        <span className="text-[#2D87F3]">{post.title}</span>
                    </li>
                </ul>
            </div>
            <div className="max-w-6xl mx-auto ">
                <div className="mt-2 px-4 w-9/12">
                    <div className="text-4xl font-medium">{post.title}</div>
                    <div className="flex items-center text-lg text-[#858585] font-medium gap-2 mt-4">
                        <MdOutlineDateRange />
                        <span>{formatDate(post.updateAt)}</span>
                        <span> - </span>
                        <span>{post.userId && post.userId.fullname}</span>
                    </div>
                    <div className="mt-6">
                        <div className="w-full">
                            <img
                                src={`${IMAGE_URL}${post.image}`}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="mt-8 news-content">
                            {post.content ? parse(post.content) : 'Nội dung không có sẵn'}
                            {/* <ReactMarkdown>{post.content}</ReactMarkdown> */}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between gap-2 mt-10 mb-2 text-2xl text-[#2D87F3]">
                        <div>
                            <span className="text-4xl font-bold">Tin liên quan</span>
                        </div>
                        <p
                            onClick={() => navigate('/tin-tuc')}
                            className="text-sm font-semibold cursor-pointer hover:underline flex items-center gap-1"
                        >
                            <span>Xem tất cả</span>
                            <FaAngleRight className="mt-1" />
                        </p>
                    </div>
                    <div className="mt-7 mb-11">
                        <div className="flex flex-wrap">
                            {posts.slice(0, 4).map((post, index) => (
                                <div key={index} className=" px-1 w-1/4 group">
                                    <NavLink
                                        to={`/tin-tuc/${formatTitleForUrl(post.title)}-${post.postId}`}
                                        className="cursor-pointer p-3 border border-transparent group-hover:boder group-hover:border-[#00B5F1] rounded-2xl group-hover:shadow-lg block"
                                    >
                                        <div className="flex flex-col">
                                            <div className="w-full h-40 overflow-hidden">
                                                <img
                                                    src={`${IMAGE_URL}${post.image}`}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover rounded-2xl"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex flex-col mt-2">
                                                <h3 className="text-xl font-bold group-hover:text-[#00b5f1] line-clamp-2 overflow-hidden text-ellipsis">
                                                    {post.title}
                                                </h3>
                                                <p className="mt-2 flex items-center text-xs font-medium gap-2">
                                                    <MdOutlineDateRange />
                                                    <span>{formatDate(post.updateAt)}</span>
                                                </p>
                                            </div>
                                            <button className="mt-3 flex items-center font-medium text-blue-500">
                                                Xem tiếp
                                                <FaArrowRightLong className="ml-2 mt-1" />
                                            </button>
                                        </div>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsDetail;
