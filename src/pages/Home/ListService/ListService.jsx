import { FaAngleRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import Doctor from '../ListDoctor/Doctor';
import Service from './Service';
import { RiServiceFill } from 'react-icons/ri';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Custom.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosClient } from '~/api/apiRequest';

function ListService() {
    var settings = {
        arrows: true,
        lazyLoad: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        infinite: false,
        centerMode: false,
        prevArrow: <IoIosArrowBack className="slick_prev" />,
        nextArrow: <IoIosArrowForward className="swiper-button-next" />,
    };

    const [servceCategorys, setServiceCategorys] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [services, setServices] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });

    useEffect(() => {
        const fetchServiceCategory = async () => {
            try {
                setServiceCategorys([]);
                const response = await axiosClient.get(`/service-category/dropdown`);
                if (response.status === 200) {
                    setServiceCategorys(response.data);
                    if (response.data.length > 0) {
                        setSelectedCategory(response.data[0]);
                    }
                } else {
                    toast.error('No service category are found:', response.message);
                    setServiceCategorys([]);
                }
            } catch (error) {
                toast.error('Failed to get service category:', error);
                setServiceCategorys([]);
            }
        };
        fetchServiceCategory();
    }, []);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axiosClient.get(
                    `/service/?serviceCategoryId=${selectedCategory.serviceCategoryId}&&pageNo=${pagination.page}&&pageSize=${pagination.limit}`,
                );
                if (response.status === 200) {
                    setServices(response.data);
                } else {
                    toast.error('No service  are found:', response.message);
                    setServices([]);
                }
            } catch (error) {
                toast.error('Failed to get service :', error);
                setServices([]);
            }
        };
        fetchService();
    }, [selectedCategory]);

    const handleServiceCategoryClick = (serviceCategory) => {
        setSelectedCategory(serviceCategory);
    };

    return (
        <div className="bg-[#fff]">
            <div className="max-w-6xl mx-auto px-4 pt-2 pb-10">
                <div className="flex items-center justify-between gap-2 mt-8 mb-2 text-2xl text-[#2D87F3]">
                    <div className="flex items-center gap-2">
                        <RiServiceFill />
                        <span className="text-xl font-bold">Dịch vụ nổi bật</span>
                    </div>
                    <p className="text-sm font-semibold cursor-pointer hover:underline flex items-center gap-1">
                        <NavLink to="/tat-ca-bac-si">Xem tất cả</NavLink>
                        <FaAngleRight className="mt-1" />
                    </p>
                </div>
                <div className="mt-6 mb-2">
                    <ul className="flex text-sm gap-2">
                        {servceCategorys.map((serviceCategory, index) => (
                            <li
                                key={index}
                                className={`border px-[12px] py-[7px] cursor-pointer rounded-[60px] hover:border-transparent ${
                                    selectedCategory === serviceCategory
                                        ? 'border-transparent bg-customLightBlue text-customBlue'
                                        : 'border-customGray hover:bg-customLightBlue hover:text-customBlue'
                                }`}
                                onClick={() => handleServiceCategoryClick(serviceCategory)}
                            >
                                {serviceCategory.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div></div>
                <Slider {...settings}>
                    {services.length > 0 && services.map((service, index) => <Service key={index} data={service} />)}
                </Slider>
            </div>
        </div>
    );
}

export default ListService;
