import React, { useState } from 'react';

interface TopicInputProps {
    onGenerate: (topic: string) => void;
    isLoading: boolean;
}

const topicsByLevel = {
    'A1': [
        "الضمائر الشخصية (Nominativ)",
        "تصريف الأفعال في المضارع (Präsens)",
        "أدوات التعريف والتنكير (Artikel)",
        "تكوين الجملة البسيطة (Hauptsatz)",
        "أدوات النفي (Nicht und Kein)",
        "حالة المفعول به (Akkusativ)",
        "الأفعال المساعدة (Haben und Sein)",
        "الأفعال المنفصلة (Trennbare Verben)",
        "صيغة الأمر (Imperativ)",
        "حروف الجر مع Akkusativ",
        "أدوات الملكية (Possessivartikel)",
        "الأسئلة (W-Fragen & Ja/Nein-Fragen)",
    ],
    'A2': [
        "زمن الماضي التام (Perfekt)",
        "حالة الجر (Dativ)",
        "حروف الجر مع Dativ",
        "حروف الجر المتغيرة (Wechselpräpositionen)",
        "الأفعال الانعكاسية (Reflexive Verben)",
        "تصريف الصفات (Adjektivdeklination)",
        "صيغ المقارنة والتفضيل (Komparativ & Superlativ)",
        "الجمل الجانبية مع 'weil' و 'dass'",
        "الأفعال المساعدة (Modalverben)",
        "زمن الماضي البسيط لـ 'haben' و 'sein'",
        "الجمل الموصولة (Relativsätze im Nominativ/Akkusativ)",
        "روابط الجمل (Konjunktionen wie 'denn', 'sondern')",
    ],
    'B1': [
        "زمن الماضي البسيط (Präteritum)",
        "حالة المضاف إليه (Genitiv)",
        "المبني للمجهول (Passiv Präsens & Präteritum)",
        "صيغة التمني (Konjunktiv II)",
        "الجمل اللانهائية مع 'zu' (Infinitiv mit zu)",
        "الجمل الجانبية (Nebensätze) مع روابط مختلفة",
        "الجمل الموصولة مع Dativ وحروف الجر",
        "تصريف الصفات بدون أداة تعريف",
        "الأسماء الضعيفة (n-Deklination)",
        "زمن الماضي الأسبق (Plusquamperfekt)",
        "الأفعال مع حروف جر ثابتة",
        "روابط الجمل المزدوجة (z.B. 'entweder...oder')",
    ],
    'B2': [
        "المبني للمجهول في جميع الأزمنة (Passiv alle Zeiten)",
        "صيغة الافتراض (Konjunktiv I - Indirekte Rede)",
        "تحويل الصفات والأسماء إلى أفعال والعكس",
        "استخدام Partizip I و II كصفات",
        "الجمل المبنية على Partizip (Partizipialkonstruktionen)",
        "زمن المستقبل الثاني (Futur II)",
        "الأفعال ذات المعنى غير الحقيقي (Subjektive Bedeutung der Modalverben)",
        "الروابط النحوية المتقدمة (Konnektoren)",
        "التعبيرات الاصطلاحية مع الأفعال (Funktionsverbgefüge)",
        "حالة المضاف إليه مع أسماء الأعلام",
        "أسلوب الكلام الرسمي وغير المباشر",
        "الفروق الدقيقة بين حروف الجر",
    ]
};

type Level = 'A1' | 'A2' | 'B1' | 'B2';

const TopicInput: React.FC<TopicInputProps> = ({ onGenerate, isLoading }) => {
    const [topic, setTopic] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<Level>('A1');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(topic);
    };

    return (
        <div dir="rtl" className="w-full p-4 sm:p-6 bg-gray-900 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="اكتب موضوعًا... أو اختر من المستويات بالأسفل"
                    className="flex-grow bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? 'جاري الإنشاء...' : 'أنشئ الدرس'}
                </button>
            </form>
            <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">اختر مستواك لتصفح المواضيع المقترحة:</p>
                {/* Level selection tabs */}
                <div className="flex border-b border-gray-700 mb-4 overflow-x-auto whitespace-nowrap">
                    {(Object.keys(topicsByLevel) as Level[]).map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`py-2 px-4 -mb-px font-semibold text-sm transition-colors duration-300 flex-shrink-0 ${
                                selectedLevel === level
                                    ? 'border-b-2 border-amber-500 text-amber-400'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {level.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Topics for the selected level */}
                <div className="flex flex-wrap gap-2 animate-fade-in">
                    {topicsByLevel[selectedLevel].map((suggestedTopic) => (
                        <button
                            key={suggestedTopic}
                            onClick={() => onGenerate(suggestedTopic)}
                            disabled={isLoading}
                            className="bg-gray-800/50 hover:bg-gray-800 text-gray-300 text-sm py-1.5 px-3 rounded-full transition-colors disabled:opacity-50"
                        >
                            {suggestedTopic}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicInput;