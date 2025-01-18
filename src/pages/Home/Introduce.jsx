import { Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { FaStethoscope } from 'react-icons/fa';
import './Introduce.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

function Introduce() {
    return (
        <div className="bg-[#F8F9FC] pt-8">
            <div className="max-w-6xl mx-auto px-4 pt-2 pb-10 flex gap-6">
                <div className="w-2/5">
                    <div className="flex items-center gap-2 text-xl font-bold mb-4 text-[#2D87F3]">
                        <FaStethoscope className="text-2xl" />
                        <span>Sự hiện diện toàn cầu của chúng tôi</span>
                    </div>
                    <p className="mb-6">
                        Người dùng nghĩ gì về nền tảng đặt lịch Hello Bacsi? Nền tảng hỗ trợ bệnh nhân kết nối trực tiếp
                        với các bác sĩ, bệnh viện và phòng khám dù bạn đang ở bất kỳ đâu.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-2">
                            <svg
                                width="18"
                                height="19"
                                viewBox="0 0 18 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 17.465a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" fill="#00B16A"></path>
                                <path
                                    d="M12.45 7.715l-4.95 4.5-2.25-2.046"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                            Đặt lịch nhanh chóng
                        </li>
                        <li className="flex items-center gap-2">
                            <svg
                                width="18"
                                height="19"
                                viewBox="0 0 18 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 17.465a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" fill="#00B16A"></path>
                                <path
                                    d="M12.45 7.715l-4.95 4.5-2.25-2.046"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                            Chủ động thời gian
                        </li>
                        <li className="flex items-center gap-2">
                            <svg
                                width="18"
                                height="19"
                                viewBox="0 0 18 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 17.465a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" fill="#00B16A"></path>
                                <path
                                    d="M12.45 7.715l-4.95 4.5-2.25-2.046"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                            Dễ dàng kết nối với bác sĩ
                        </li>
                    </ul>
                </div>
                <div className="w-3/5 bg-white rounded-lg px-14 py-8">
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]}
                        effect="coverflow"
                        spaceBetween={50}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: true,
                        }}
                        navigation={{
                            prevEl: '.swiper-button-prev',
                            nextEl: '.swiper-button-next',
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        onSwiper={(swiper) => {                           
                            swiper.autoplay.start();
                        }}
                        className="h-72"
                    >
                        <SwiperSlide>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src="https://cdn-healthcare.hellohealthgroup.com/2024/05/425537255_7947957171886506_160633297562532715_n.jpg?w=48&q=100"
                                        alt="ảnh"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-xl">Thúy Phạm</h4>
                                    <p className="text-sm">Hồ Chí Minh</p>
                                </div>
                            </div>
                            <div className="text-lg mt-4">
                                Mình đặt lịch khám thai định kỳ với BS. Thủy trên Hello Bacsi. Bác chu đáo, tận tâm,
                                được nhiều chị đồng nghiệp giới thiệu lại. Đến giờ bé nhà cũng được gần 1 tháng rồi,
                                trộm vía mẹ tròn con vuông, rất cảm ơn bác.
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src="https://cdn-healthcare.hellohealthgroup.com/2024/05/351468920_660337602799142_5522556505484125412_n.jpg?w=48&q=100"
                                        alt="ảnh"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-xl">Kim Thuận</h4>
                                    <p className="text-sm">Hà Nội</p>
                                </div>
                            </div>
                            <div className="text-lg mt-4">
                                Bố mẹ lớn tuổi, chân yếu nên mình cũng ngại đưa đi khám xa. Lên Hello Bacsi thì kiếm
                                được phòng khám gần nhà nên đặt luôn, đến chỉ việc xác nhận thông tin rồi vào khám,
                                không phải chờ quá lâu.
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src="https://cdn-healthcare.hellohealthgroup.com/2023/10/TranLinhGiang-photo.JPG?w=48&q=100"
                                        alt="ảnh"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-xl">Jang Trần</h4>
                                    <p className="text-sm">Đồng Nai</p>
                                </div>
                            </div>
                            <div className="text-lg mt-4">
                                Mình đặt gói khám tổng quát xin việc trên Hello Bacsi. Khi tới bệnh viện có bạn nhân
                                viên xác nhận lịch hẹn rồi vào khám luôn, khá là tiện lợi.
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F3126ceaa-54ae-4916-a2a0-9d83d45b5561-mai-vy.jpg&w=1920&q=75"
                                        alt="ảnh"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-xl">Ngọc Trân</h4>
                                    <p className="text-sm">Bình Định</p>
                                </div>
                            </div>
                            <div className="text-lg mt-8">
                                Gần đây mình đau bụng kinh bất thường nên quyết định đặt gói khám phụ khoa tổng quát
                                trên nền tảng, có ưu đãi nên chi phí cũng không quá mắc. Quy trình đơn giản vì mình đã
                                thanh toán trước. Mình cảm giác an tâm khi đặt lịch khám những vấn đề sức khỏe phụ nữ
                                như vậy.
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src="https://cdn-healthcare.hellohealthgroup.com/2024/05/399910572_2255382887988893_7638162135008804004_n.jpg?w=48&q=100"
                                        alt="ảnh"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-xl">Minh Quân</h4>
                                    <p className="text-sm">Hồ Chí Minh</p>
                                </div>
                            </div>
                            <div className="text-lg mt-8">
                                Bé chướng ăn bất thường nên mình tìm bác sĩ dinh dưỡng khám cho bé. Đặt xong thì có bạn
                                gọi điện xác nhận lịch hẹn ngay làm mình cũng yên tâm khi đến phòng khám.
                            </div>
                        </SwiperSlide>

                        <div className="swiper-button-prev">
                            <IoIosArrowBack />
                        </div>
                        <div className="swiper-button-next">
                            <IoIosArrowForward />
                        </div>
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default Introduce;
