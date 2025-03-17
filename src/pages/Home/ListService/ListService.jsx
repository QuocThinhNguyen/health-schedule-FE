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

function ListService() {
    var settings = {
        arrows: true,
        lazyLoad: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        infinite: false,
        prevArrow: <IoIosArrowBack className="slick_prev" />,
        nextArrow: <IoIosArrowForward className="swiper-button-next" />,
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
                        <li className="border border-transparent bg-customLightBlue text-customBlue px-[12px] py-[7px] cursor-pointer rounded-[60px]">
                            Sức khỏe
                        </li>
                        <li className="border border-customGray  px-[12px] py-[7px] cursor-pointer rounded-[60px] hover:border-transparent hover:bg-customLightBlue hover:text-customBlue">
                            Xét nghiệm
                        </li>
                        <li className="border border-customGray  px-[12px] py-[7px] cursor-pointer rounded-[60px] hover:border-transparent hover:bg-customLightBlue hover:text-customBlue">
                            Tiêm chủng
                        </li>
                    </ul>
                </div>
                <div></div>
                {/* <div className="flex flex-wrap">
                    <Service />
                    <Service1 />
                    <Service />
                    <Service />

                </div> */}
                <Slider {...settings}>
                    <Service />
                    <Service />
                    <Service />
                    <Service />

                    <Service />
                    <Service />
                </Slider>
            </div>
        </div>
    );
}

export default ListService;
