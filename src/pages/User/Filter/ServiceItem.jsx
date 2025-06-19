import { useNavigate } from 'react-router-dom';
import { BsCoin } from 'react-icons/bs';
import { formatTitleForUrl } from '~/utils/formatTitleForUrl';

function ServiceItem({ data }) {
    const navigate = useNavigate();
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const handleClickService = () => {
        navigate(`/dich-vu/${formatTitleForUrl(data.name)}-${data.serviceId}`);
    };
    return (
        <div className="rounded-lg mb-4 border border-[#E4E8EC]">
            <div className="px-4 pt-4 mb-4 flex gap-4">
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-customTitle">{data?.name || 'Chưa xác định'}</h3>
                        </div>
                    </div>

                    <p className="flex items-center gap-x-2 mb-2">
                        <BsCoin className="mt-[2px] " />
                        <span>Giá</span>
                        <span className="text-customYellow text-lg font-medium">{formatCurrency(data?.price)}</span>
                    </p>
                </div>
            </div>

            <div className="bg-[#F8F9FC] px-4 py-2 flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <img
                        src={data?.clinicImage}
                        alt={data?.name || 'Chưa xác định'}
                        className="w-10 h-10 rounded-full object-cover border border-[#E4E8EC]"
                    />
                    <div>
                        <div className="font-semibold text-sm">{data?.clinicName || 'Chưa xác định'}</div>
                        <div className="text-xs text-[#595959]">{data?.clinicAddress || 'Chưa xác định'}</div>
                    </div>
                </div>
                <div
                    onClick={handleClickService}
                    className=" h-10 leading-6 bg-customBlue hover:bg-blue-600 text-white border px-5 py-2 rounded-lg font-semibold cursor-pointer"
                >
                    Đặt Lịch Hẹn
                </div>
            </div>
        </div>
    );
}

export default ServiceItem;
