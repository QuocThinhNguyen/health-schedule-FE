import { X, Search, AlertCircle, Heart, Brain, Thermometer, Stethoscope, Eye, Activity } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
function FormRecommendationDoctor({ onClose, onRecommend }) {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const symptomCategories = [
        {
            id: 1,
            label: 'Đau bụng, buồn nôn, vàng da, gan to',
            icon: <AlertCircle className="h-5 w-5" />,
            color: 'text-orange-600',
            specialties: ['Tiêu hóa gan mật'],
            description: 'Các vấn đề về gan, mật, tiêu hóa',
        },
        {
            id: 2,
            label: 'Sốt, mệt mỏi, giảm cân, khó thở',
            icon: <Thermometer className="h-5 w-5" />,
            color: 'text-red-600',
            specialties: ['Nội tổng quát'],
            description: 'Triệu chứng toàn thân, không rõ nguyên nhân',
        },
        {
            id: 3,
            label: 'Mẩn đỏ, ngứa, nổi mề đay, viêm da',
            icon: <AlertCircle className="h-5 w-5" />,
            color: 'text-pink-600',
            specialties: ['Da liễu'],
            description: 'Các bệnh về da, móng, tóc',
        },
        {
            id: 4,
            label: 'Đau ngực, hồi hộp, khó thở, phù chân',
            icon: <Heart className="h-5 w-5" />,
            color: 'text-red-600',
            specialties: ['Nội tim mạch'],
            description: 'Các vấn đề về tim mạch, huyết áp',
        },
        {
            id: 5,
            label: 'Đau đầu, chóng mặt, tê liệt, co giật',
            icon: <Brain className="h-5 w-5" />,
            color: 'text-purple-600',
            specialties: ['Nội thần kinh'],
            description: 'Các bệnh về thần kinh, não bộ',
        },
        {
            id: 6,
            label: 'Đau khớp, sưng khớp, cứng khớp buổi sáng',
            icon: <Activity className="h-5 w-5" />,
            color: 'text-green-600',
            specialties: ['Nội cơ xương khớp'],
            description: 'Các bệnh về khớp, cơ, xương',
        },
        {
            id: 7,
            label: 'Đau họng, nghẹt mũi, ù tai, chảy máu mũi',
            icon: <AlertCircle className="h-5 w-5" />,
            color: 'text-blue-600',
            specialties: ['Tai mũi họng'],
            description: 'Các vấn đề về tai, mũi, họng',
        },
        {
            id: 8,
            label: 'Mờ mắt, đau mắt, chảy nước mắt, nhìn đôi',
            icon: <Eye className="h-5 w-5" />,
            color: 'text-indigo-600',
            specialties: ['Mắt'],
            description: 'Các bệnh về mắt, thị lực',
        },
        {
            id: 9,
            label: 'Ợ hơi, ợ chua, đầy bụng, táo bón',
            icon: <AlertCircle className="h-5 w-5" />,
            color: 'text-yellow-600',
            specialties: ['Tiêu hóa'],
            description: 'Các vấn đề tiêu hóa thông thường',
        },
        {
            id: 10,
            label: 'Đau răng, sưng lợi, khô miệng, đau hàm',
            icon: <AlertCircle className="h-5 w-5" />,
            color: 'text-teal-600',
            specialties: ['Răng hàm mặt'],
            description: 'Các vấn đề về răng, miệng, hàm mặt',
        },
    ];

    const handleSymptomToggle = (symptomId) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
        );
    };

    const handleSuggestDoctor = () => {
        console.log('Các triệu chứng đã chọn:', selectedSymptoms);
        onRecommend(selectedSymptoms);
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh]  bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex  justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div>
                            <img src="ask-for-help.png" className="w-12 h-12" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Chúng tôi có thể giúp gì cho bạn hôm nay?</h2>
                            <p className="text-gray-600 mt-1">
                                Vui lòng chọn triệu chứng bạn đang gặp phải để chúng tôi gợi ý bác sĩ phù hợp.
                            </p>
                        </div>
                    </div>
                    <div>
                        <button onClick={onClose}>
                            <X className="text-red-500 hover:text-red-600" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto h-full max-h-[70vh]">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">Chọn triệu chứng bạn đang gặp phải:</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {symptomCategories.map((symptom) => (
                            <div
                                key={symptom.id}
                                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50 ${
                                    selectedSymptoms.includes(symptom.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200'
                                }`}
                                onClick={() => handleSymptomToggle(symptom.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSymptoms.includes(symptom.id)}
                                    onChange={() => handleSymptomToggle(symptom.id)}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded pointer-events-none"
                                />
                                <div className={`${symptom.color} mt-1`}>{symptom.icon}</div>
                                <div className="flex-1">
                                    <label className="font-medium cursor-pointer block mb-1">{symptom.label}</label>
                                    <p className="text-xs text-gray-500 mb-2">{symptom.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {symptom.specialties.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            onClick={onClose}
                        >
                            Bỏ qua
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            onClick={handleSuggestDoctor}
                        >
                            Gợi ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormRecommendationDoctor;
