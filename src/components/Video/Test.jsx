import { Heart } from "lucide-react";

function Test() {
    return (
        <>
            <div className="flex items-center justify-start gap-2">
                <img src="/mail.png" alt="avatar" className="w-10 h-10 rounded-full border-2" />
                <div className="w-full">
                    <div className="font-semibold text-sm">Nguyễn Thị Hương</div>
                    <div className="items-center justify-start flex w-full">
                        <div className="text-base max-w-80">
                            em ho bữa giờ không hết, uống thuốc quài không đỡ càng ho nhiều hơn
                        </div>
                        <div className="flex flex-col items-center ml-auto">
                            <Heart className="w-5 h-5 text-black " />
                            <span>1</span>
                        </div>
                    </div>
                    <span className="text-[#9fa0a5] text-sm mr-2">2025-01-05</span>
                    <span className="text-[#9fa0a5] text-sm cursor-pointer">Trả lời</span>
                </div>
            </div>
            <div className="flex items-center justify-start gap-2 pl-10 mt-2">
                <img src="/mail.png" alt="avatar" className="w-8 h-8 rounded-full border-2" />
                <div className="w-full">
                    <div className="flex items-center justify-start gap-1">
                        <div className="font-semibold text-sm">Phạm Duy Kiên</div>
                        <div>·</div>
                        <div className="font-semibold text-sm text-[#FE2C55]">Bác sĩ</div>
                    </div>

                    <div className="items-center justify-start flex w-full">
                        <div className="text-base max-w-80">Bạn nên đến bệnh viện để được tư vấn cụ thể hơn</div>
                        <div className="flex flex-col items-center ml-auto">
                            <Heart className="w-5 h-5 text-black " />
                            <span>1</span>
                        </div>
                    </div>
                    <span className="text-[#9fa0a5] text-sm mr-2">2025-01-06</span>
                    <span className="text-[#9fa0a5] text-sm cursor-pointer">Trả lời</span>
                </div>
            </div>
        </>
    );
}

export default Test;
