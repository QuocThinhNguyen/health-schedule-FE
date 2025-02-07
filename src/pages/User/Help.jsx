import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

function Help() {
    const [openItem, setOpenItem] = useState(-1);

    const faqItems = [
        {
            question: 'EasyMed là gì?',
            answer: 'EasyMed là một nền tảng chăm sóc sức khỏe trực tuyến. Chúng tôi cung cấp thông tin, công cụ và dịch vụ hỗ trợ sức khỏe - tất cả nội dung đều đã được tham vấn chuyên môn. Sứ mệnh của chúng tôi là giúp bạn và người thân lựa chọn các quyết định sáng suốt, từ đó sống khỏe mạnh và hạnh phúc hơn. EasyMed là công ty tư nhân thuộc sở hữu của Hello Health Group Pte. Ltd. và hoạt động tại Việt Nam.',
        },
        {
            question: 'Vì sao tôi nên đăng ký tài khoản?',
            answer: 'Đăng ký tài khoản giúp bạn có thể tận dụng đầy đủ các tính năng của EasyMed, bao gồm đặt lịch khám, lưu hồ sơ sức khỏe và nhận tư vấn y tế.',
        },
        {
            question: 'Đăng ký ở EasyMed có mất phí không?',
            answer: 'Không, việc đăng ký tài khoản tại EasyMed hoàn toàn miễn phí.',
        },
        {
            question: 'Nếu tôi có thắc mắc liên quan đến sức khỏe, làm thế nào để đặt câu hỏi?',
            answer: 'Bạn có thể đặt câu hỏi thông qua mục Tư vấn sức khỏe trên trang web hoặc ứng dụng của chúng tôi. Các bác sĩ chuyên môn sẽ trả lời câu hỏi của bạn.',
        },
        {
            question: 'Tôi quan ngại về quyền riêng tư của mình',
            answer: 'Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Mọi thông tin được mã hóa và bảo mật theo tiêu chuẩn cao nhất.',
        },
        {
            question: 'Tôi muốn xóa tài khoản và hủy đăng ký',
            answer: 'Bạn có thể xóa tài khoản trong phần Cài đặt tài khoản. Sau khi xác nhận, tài khoản của bạn sẽ được xóa khỏi hệ thống.',
        },
        {
            question: 'Nếu tôi xóa tài khoản, dữ liệu của tôi sẽ ra sao?',
            answer: 'Khi bạn xóa tài khoản, tất cả dữ liệu cá nhân của bạn sẽ được xóa khỏi hệ thống của chúng tôi theo quy định về bảo vệ dữ liệu.',
        },
    ];

    return (
        <div className="max-w-3xl overflow-y-auto mt-20 mb-20">
            <h1 className="text-2xl text-black font-bold mb-6">Trợ giúp</h1>

            <div className="space-y-4">
                {faqItems.map((item, index) => (
                    <div key={index} className="border-b">
                        <button
                            className="w-full flex items-center justify-between p-4 text-left font-bold"
                            onClick={() => setOpenItem(openItem === index ? -1 : index)}
                        >
                            {item.question}
                            <ChevronDown
                                className={`w-5 h-5 text-gray-500 transition-transform ${
                                    openItem === index ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {openItem === index && <div className="px-4 pb-4 text-gray-600">{item.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Help;
