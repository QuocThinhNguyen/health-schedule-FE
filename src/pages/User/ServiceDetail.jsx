import {
    Banknote,
    Smartphone,
} from 'lucide-react';
import { BsCoin } from 'react-icons/bs';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import '../User/News/NewsDetail.css';
import { CiHospital1, CiLocationOn } from 'react-icons/ci';

function ServiceDetail() {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const timeSlots = [
        { label: '8:00 - 9:00', value: 'T1' },
        { label: '9:00 - 10:00', value: 'T2' },
        { label: '10:00 - 11:00', value: 'T3' },
        { label: '11:00 - 12:00', value: 'T4' },
        { label: '13:00 - 14:00', value: 'T5' },
        { label: '14:00 - 15:00', value: 'T6' },
        { label: '15:00 - 16:00', value: 'T7' },
        { label: '16:00 - 17:00', value: 'T8' },
    ];
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
                            Dịch vụ
                        </NavLink>
                    </li>
                    <li className="flex items-center cursor-pointer">
                        <MdKeyboardArrowRight className="mt-1" />
                        <span className="text-[#2D87F3]">
                            Tiêm vắc xin MMR II 3 trong 1 phòng Sởi – Quai bị – Rubella
                        </span>
                    </li>
                </ul>
            </div>
            {/* Header */}
            <div className="bg-white h-[300px] relative">
                <div className="relative rounded-xl overflow-hidden mt-5 flex justify-center items-center border-none outline-none">
                    <img
                        className="relative w-full  px-4 max-w-6xl h-96 rounded-lg overflow-hidden bg-cover bg-center"
                        src="https://cdn-healthcare.hellohealthgroup.com/banners/vn/1EzL38IbPN1vyH13yRj4_mreG80vWE5c-.png"
                    />
                </div>

                {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-80 z-10 relative"></div> */}
                <div className="max-w-6xl mx-auto h-40 z-10 relative opacity-100">
                    <div className="flex items-center justify-between px-4 mt-[-40px]">
                        <div className="flex items-center gap-5">
                            <img
                                src="https://cdn-healthcare.hellohealthgroup.com/services/Specialty.png"
                                alt="Tiêm vaccine HPV Gardasil 9"
                                className=" h-36 w-36 rounded-full border-white shadow-lg"
                            />

                            <div className="mt-8">
                                <h1 className="text-[22px] font-bold">Tiêm vaccine HPV Gardasil 9</h1>
                                <p className="flex items-center gap-x-2 mt-2">
                                    <BsCoin className="mt-[2px] " />
                                    <span className="text-customYellow text-lg font-medium">
                                        {formatCurrency(4100000)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 mt-52 h-2"></div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mt-6 mb-24 px-4 mx-auto relative overflow: visible">
                <div className="flex-1">
                    <Tabs>
                        <TabList className="flex gap-5 text-custom8C8C8C font-bold border-b border-customGray mb-6">
                            <Tab
                                className="pb-2 cursor-pointer outline-none border-b-2"
                                selectedClassName="text-customBlue border-b-2 border-customBlue"
                                
                            >
                                Thông tin cơ bản
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-custom284a75  border-l-4 leading-[18px] border-customBlue pl-3">
                                    Về dịch vụ
                                </h2>
                                <div className="news-content">
                                    <p>
                                        Vaccine Gardasil 9 được sản xuất bởi Tập đoàn Dược phẩm và Chế phẩm sinh học
                                        Merck Sharp &amp; Dohme (MSD – Mỹ), phòng 9 tuýp virus HPV 6, 11, 16, 18, 31,
                                        33, 45, 52 và 58.
                                    </p>
                                    <p>
                                        Bên cạnh tác dụng phòng ngừa ung thư cổ tử cung, vaccine còn có khả năng phòng
                                        ngừa các tình trạng bệnh lý nguy hiểm khác như: ung thư âm đạo, tổn thương tiền
                                        ung thư và loạn sản, mụn cóc sinh dục ở cả nam và nữ giới.
                                    </p>
                                    <p>
                                        Vaccine được chỉ định tiêm cho đối tượng từ 9 - 27 tuổi với lộ trình bao gồm 3
                                        mũi (Người từ 9 - 15 tuổi có phác đồ tiêm 2 mũi).
                                    </p>
                                </div>
                                <h2 className="text-lg font-semibold mb-2 text-custom284a75  border-l-4 leading-[18px] border-customBlue pl-3">
                                    Quá trình chuẩn bị
                                </h2>
                                <div className="news-content">
                                    <p>
                                        • Vaccine được tiêm cho đối tượng từ 9 - 27 tuổi, kể cả trường hợp bạn đã hay
                                        chưa quan hệ tình dục.
                                    </p>
                                    <p>
                                        • Sau 27 tuổi, vaccine HPV có thể không phát huy tối đa tác dụng. Do đó, nếu
                                        quyết định tiêm, bạn nên nhận thêm sự tư vấn từ các chuyên gia.
                                    </p>
                                </div>
                                <h2 className="text-lg font-semibold mb-2 text-custom284a75  border-l-4 leading-[18px] border-customBlue pl-3">
                                    Chi tiết dịch vụ
                                </h2>
                                <div className="news-content">
                                    <p>
                                        • Phác đồ tiêm chủng cho bé từ tròn 9 tuổi đến dưới 15 tuổi tại thời điểm tiêm
                                        lần đầu tiên: Phác đồ 2 mũi: + Mũi 1: lần tiêm đầu tiên trong độ tuổi + Mũi 2:
                                        cách mũi 1 từ 6 - 12 tháng. Nếu mũi 2 tiêm cách mũi 1 5 tháng, cần tiêm mũi 3
                                        cách mũi 2 ít nhất 3 tháng. Phác đồ 3 mũi Mũi 1: lần tiêm đầu tiên trong độ tuổi
                                        Mũi 2: cách mũi 1 ít nhất 2 tháng Mũi 3: cách mũi 2 ít nhất 4 tháng • Phác đồ
                                        tiêm cho người từ tròn 15 tuổi đến dưới 27 tuổi tại thời điểm tiêm lần đầu tiên:
                                        Phác đồ 3 mũi: Mũi 1: lần tiêm đầu tiên trong độ tuổi Mũi 2: cách mũi 1 ít nhất
                                        2 tháng Mũi 3: cách mũi 2 ít nhất 4 tháng. • Phác đồ tiêm nhanh: Mũi 1: lần tiêm
                                        đầu tiên trong độ tuổi. Mũi 2: cách mũi 1 ít nhất 1 tháng Mũi 3: cách mũi 2 ít
                                        nhất 3 tháng. Giá Vắc-xin Gardasil 9 (1 mũi): 2,970,000 VNĐ Phí bác sĩ khám sàng
                                        lọc trước tiêm ngừa: 100,000 VNĐ/ 1 lượt
                                    </p>
                                </div>
                                <h2 className="text-lg font-semibold mb-2 text-custom284a75  border-l-4 leading-[18px] border-customBlue pl-3">
                                    Phương thức thanh toán
                                </h2>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div className="border rounded-lg hover:border-blue-200 transition-colors cursor-pointer p-6 flex flex-col items-center justify-center">
                                        <Banknote className="w-8 h-8 text-green-600 mb-2" />
                                        <span className="text-sm font-medium">Tiền mặt</span>
                                    </div>

                                    <div className="border rounded-lg hover:border-blue-200 transition-colors cursor-pointer p-6 flex flex-col items-center justify-center">
                                        <Smartphone className="w-8 h-8 text-blue-600 mb-2" />
                                        <span className="text-sm font-medium">Thanh toán trực tuyến</span>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>

                <div className="max-w-96 ">
                    <div className="bg-blue-100 rounded-lg p-4 sticky top-[72px]">
                        <div className="mb-4 text-sm">
                            <div className="text-lg font-bold mb-1">Đặt lịch ngay</div>
                            <p className="flex items-center gap-x-2">
                                <CiHospital1 className="mt-[2px] text-base" />
                                Bệnh viện Quốc Tế Vinmec
                            </p>
                            <p className="flex items-start gap-x-2">
                                <span>
                                    <CiLocationOn className="mt-1 text-base" />
                                </span>
                                <span className="line-clamp-2">
                                    435/80F, nguyễn An Ninh, Bình Dương, thành phố bình dươngViệt nam
                                </span>
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-2">
                            <div className="font-bold text-lg flex justify-center items-center border-b">
                                Tư vấn trực tiếp
                            </div>
                            <div className="p-2">
                                <p className="text-gray-600 text-sm text-center">
                                    Vui lòng lựa chọn lịch khám bên dưới
                                </p>
                                <input type="date" className="w-full px-4 h-10 border rounded-lg cursor-pointer mt-2" />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 h-full">
                                    {timeSlots.length > 0 &&
                                        timeSlots.map((timeSlot, index) => (
                                            <button
                                                key={index}
                                                value={timeSlot.value}
                                                className="py-2 px-1 font-semibold text-xs border rounded-lg border-customBlue text-customBlue hover:bg-blue-100"
                                            >
                                                {timeSlot.label}
                                            </button>
                                        ))}
                                </div>

                                {/* <div
                                    className=""
                                            
                                >
                                    <div className="flex flex-col items-center justify-center p-2 text-center">
                                        <img src="/schedule.png" alt="sf" className="h-20 w-20" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Rất tiếc! Bác sĩ của chúng tôi hiện đang bận.
                                        </h3>
                                        <p className="text-gray-600">
                                            Xin vui lòng quay lại vào ngày mai hoặc đặt lịch với bác sĩ khác.
                                        </p>
                                    </div>
                                </div> */}

                                <p className="flex items-center gap-x-2 mt-4">
                                    <BsCoin className="mt-[2px] " />
                                    <span className="text-customYellow text-lg font-medium">
                                        {formatCurrency(4100000)}
                                    </span>
                                </p>

                                {/* Nút đặt lịch */}
                                <button
                                    className="w-full py-2 rounded-lg mt-1 bg-customBlue text-white hover:bg-blue-600 cursor-pointer"
                                    // onClick={() => handleTimeSlotClick(selectedTime)}
                                    // disabled={schedule.length <= 0 || !selectedTime}
                                >
                                    TIẾP TỤC ĐẶT LỊCH
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceDetail;
