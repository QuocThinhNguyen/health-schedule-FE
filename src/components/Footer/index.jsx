import { NavLink } from 'react-router-dom';

function Footer() {
    const footerNavs = [
        {
            label: 'Về EasyMed',
            items: [
                {
                    href: '#',
                    name: 'Giói thiệu về EasyMed',
                },
                {
                    href: '#',
                    name: 'Liên hệ',
                },
            ],
        },
        {
            label: 'Dịch vụ',
            items: [
                {
                    href: '#',
                    name: 'Đặt khám bệnh viện',
                },
                {
                    href: '#',
                    name: 'Đặt khám bác sĩ',
                },
            ],
        },
        {
            label: 'Hổ trợ',
            items: [
                {
                    href: '#',
                    name: 'Điều Khoản Sử Dụng',
                },
                {
                    href: '#',
                    name: 'Chính Sách Bảo Mật',
                },
                {
                    href: '#',
                    name: 'Chính sách giải quyết khiếu nại',
                },
                {
                    href: '#',
                    name: 'Hỗ trợ khách hàng: cskh@easymed.vn',
                },
            ],
        },
    ];

    return (
        <footer className="text-white bg-[#1B3250] text-sm font-normal">
            <div className="px-4 pt-16 pb-8 mx-auto max-w-6xl">
                <div className="gap-6 justify-between md:flex">
                    <div className="flex-1">
                        <div className="">
                            <NavLink to="/" className="flex-shrink-0 flex items-center mr-auto">
                                <span className="text-4xl font-bold">
                                    <span className="text-green-500">Easy</span>
                                    <span className="text-blue-500">Med</span>
                                </span>
                            </NavLink>
                            <p className="leading-relaxed mt-2 text-semibold">
                                <strong className="text-[#87909c]">Địa chỉ: </strong>01 Đ. Võ Văn Ngân, Linh
                                Chiểu, Thủ Đức, Hồ Chí Minh
                            </p>
                            <p className="leading-relaxed mt-2 text-semibold">
                                <strong className="text-[#87909c]">Website: </strong>https://medpro.vn
                            </p>
                            <p className="leading-relaxed mt-2 text-semibold">
                                <strong className="text-[#87909c]">Email: </strong>cskh@medpro.vn
                            </p>
                            <p className="leading-relaxed mt-2 text-semibold">
                                <strong className="text-[#87909c]">Điện thoại: </strong>(028) 3896 8641
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 mt-10 space-y-6 items-start justify-between sm:flex md:space-y-0 md:mt-0">
                        {footerNavs.map((item, idx) => (
                            <ul className="space-y-3" key={idx}>
                                <h4 className="text-[#87909c] font-semibold text-base">{item.label}</h4>
                                {item.items.map((el, idx) => (
                                    <li key={idx}>
                                        <a href={el.href} className="hover:underline hover:text-indigo-600">
                                            {el.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>
                <div className="mt-8 py-6 border-t border-[#e4e8ec1a] text-center text-[#9aa2ac]">
                    <div className="mt-4 sm:mt-0">
                        Các thông tin trên YouMed chỉ dành cho mục đích tham khảo, tra cứu và không thay thế cho việc
                        chẩn đoán hoặc điều trị y khoa.
                    </div>
                    <div className="mt-4 sm:mt-0">Cần tuyệt đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế..</div>
                    <div className="mt-4 sm:mt-0">Copyright © 2018 - 2024 Công ty TNHH EasyMed Việt Nam.</div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
