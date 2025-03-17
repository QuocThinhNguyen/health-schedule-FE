import { BsCoin } from 'react-icons/bs';

function ServiceItem() {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <div className="rounded-lg mb-4 border border-[#E4E8EC]">
            <div className="px-4 pt-4 mb-4 flex gap-4">
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-customTitle">
                                Tiêm vắc xin Priorix 3 trong 1 phòng Sởi – Quai bị – Rubella
                            </h3>
                        </div>
                    </div>

                    <p className="flex items-center gap-x-2 mb-2">
                        <BsCoin className="mt-[2px] " />
                        <span>Giá</span>
                        <span className="text-customYellow text-lg font-medium">{formatCurrency(4100000)}</span>
                    </p>
                </div>
            </div>

            <div className="bg-[#F8F9FC] px-4 py-2 flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <img
                        src="https://cdn-healthcare.hellohealthgroup.com/hospitals/vn/1wnumG7SuolmS0_-DxFqUbtmTfRFRmBtp.png?w=48&q=75"
                        alt="Phòng khám Nhi đồng 315 và Tiêm Chủng - Chi nhánh Lê Văn Quới - Bình Tân"
                        className="w-10 h-10 rounded-full object-cover border border-[#E4E8EC]"
                    />
                    <div>
                        <div className="font-semibold text-sm">
                            Phòng khám Nhi đồng 315 và Tiêm Chủng - Chi nhánh Lê Văn Quới - Bình Tân
                        </div>
                        <div className="text-xs text-[#595959]">
                            482 Lê Văn Quới, Phường Bình Hưng Hòa A, Quận Bình Tân, Thành phố Hồ Chí Minh
                        </div>
                    </div>
                </div>
                <div
                    // onClick={() => handleBooking(doctor.doctorId)}
                    className=" h-10 bg-customBlue hover:bg-blue-600 text-white border px-5 py-2 rounded-lg font-semibold cursor-pointer"
                >
                    Đặt Lịch Hẹn
                </div>
            </div>
        </div>
    );
}

export default ServiceItem;
