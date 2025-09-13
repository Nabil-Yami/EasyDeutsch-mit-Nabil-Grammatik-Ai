import React, { useState, useMemo, useEffect } from 'react';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

interface LessonDisplayProps {
    lesson: string;
    topic: string;
    onElaborate: () => void;
    isElaborating: boolean;
    elaboration: string | null;
    elaborationError: string | null;
    onGenerateDiagram: () => void;
    isGeneratingDiagram: boolean;
    diagram: string | null;
    diagramError: string | null;
}

const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.045m1.584 0c.386 1.11.238 2.403-.352 3.444M15.666 3.888L13.5 2.25m2.166 1.638a2.25 2.25 0 013.444-1.352L21 4.5m-4.134 1.638A2.25 2.25 0 0118 8.25v3.75a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-3.75a2.25 2.25 0 012.25-2.25h3.75m-3.75 0h-3.75a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-3.75m-3.75 0h.008v.015h-.008V5.25z" />
    </svg>
);

const sectionEmojis: { [key: string]: string } = {
    "الشرح": "📖",
    "أمثلة": "💡",
    "ملخص": "📋",
    "جدول": "📋",
    "ملاحظات": "✍️",
    "تحليل نحوي": "🔬",
    "خطأ شائع للمتحدثين بالعربية": "⚠️",
};

const parseAndRenderLesson = (lessonText: string) => {
    const lines = lessonText.split('\n').filter(line => line.trim() !== '');
    const content: (JSX.Element | null)[] = [];
    
    let isTable = false;
    let tableHeader: JSX.Element | null = null;
    let tableBodyRows: JSX.Element[] = [];

    const flushTable = () => {
        if (tableHeader || tableBodyRows.length > 0) {
            content.push(
                <div key={`table-wrapper-${content.length}`} className="overflow-x-auto my-6 shadow-md rounded-lg border border-gray-700">
                    <table className="min-w-full text-right">
                        {tableHeader && <thead className="bg-gray-800">{tableHeader}</thead>}
                        {tableBodyRows.length > 0 && <tbody className="bg-gray-900">{tableBodyRows}</tbody>}
                    </table>
                </div>
            );
        }
        tableHeader = null;
        tableBodyRows = [];
        isTable = false;
    };

    lines.forEach((line, index) => {
        // Check for Markdown table syntax
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            if (!isTable) {
                isTable = true;
            }
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            if (cells.every(c => /^-{3,}$/.test(c.replace(/:/g, '')))) {
                return; // It's a separator line, ignore it
            }
            if (!tableHeader) {
                tableHeader = (
                    <tr key={`header-${index}`}>
                        {cells.map((cell, i) => (
                            <th key={i} className="py-3 px-5 font-bold text-amber-300 border-b-2 border-gray-600 tracking-wider uppercase text-sm">{cell}</th>
                        ))}
                    </tr>
                );
            } else {
                tableBodyRows.push(
                    <tr key={`row-${index}`} className="hover:bg-amber-900/20 transition-colors">
                        {cells.map((cell, i) => (
                            <td key={i} className="py-3 px-5 border-t border-gray-700">{cell}</td>
                        ))}
                    </tr>
                );
            }
            return;
        } else if (isTable) {
            flushTable(); // End of table block
        }
        
        // Main Heading: ### **Text**
        if (line.startsWith('###')) {
            const text = line.replace(/###\s*\*\*/g, '').replace(/\*\*/g, '').trim();
            const emojiMatch = text.match(/^[🔍📜]/); // Match specific emojis
            const emoji = emojiMatch ? emojiMatch[0] : '📜';
            const cleanText = text.replace(/^[🔍📜]\s*/, '');

            content.push(<h2 key={index} className="text-2xl md:text-3xl font-bold text-amber-400 mt-2 mb-6 border-b-2 border-amber-500/30 pb-3 flex items-center">{emoji}<span className="mr-3">{cleanText}</span></h2>);
            return;
        }
        
        // Subheadings: **1. Text:** or **Text:**
        const subheadingMatch = line.match(/^\s*\*\*(.*?)\*\*/);
        if (subheadingMatch) {
            const fullTitle = subheadingMatch[1];
            const cleanTitle = fullTitle.replace(/\d+\.\s*/, '').trim().replace(/:$/, '');
            const emoji = sectionEmojis[cleanTitle] || '🔹';
            content.push(<h3 key={index} className="text-xl md:text-2xl font-semibold text-gray-100 mt-8 mb-4 flex items-center pt-4 border-t border-gray-700">{emoji}<span className="mr-3">{fullTitle}</span></h3>);
            return;
        }
        
        // List items with examples: - German (Arabic)
        if (line.trim().startsWith('-')) {
            const text = line.trim().substring(1).trim();
            const match = text.match(/^(.*?)\s*\((.*?)\)$/);
            if (match) {
                const german = match[1].trim();
                const arabic = match[2].trim();
                content.push(
                     <li key={index} className="my-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg list-none border border-gray-700 shadow-md transition-all duration-300 hover:border-amber-400/50 hover:shadow-amber-500/10">
                        <div className="flex items-start gap-3">
                            <span className="text-xl pt-1">🇩🇪</span>
                            <div>
                                <p className="font-sans text-amber-300 text-xl font-medium mb-2" dir="ltr">{german}</p>
                                <p className="text-gray-300 text-base" dir="rtl">{arabic}</p>
                            </div>
                        </div>
                    </li>
                );
            } else {
                 content.push(<p key={index} className="my-2 text-gray-300 leading-loose">{text}</p>);
            }
            return;
        }

        // Default paragraph
        content.push(<p key={index} className="my-2 text-gray-300 leading-loose">{line}</p>);
    });

    flushTable(); // Flush any remaining table at the end

    return content;
};

const LessonDisplay: React.FC<LessonDisplayProps> = ({
    lesson,
    topic,
    onElaborate,
    isElaborating,
    elaboration,
    elaborationError,
    onGenerateDiagram,
    isGeneratingDiagram,
    diagram,
    diagramError,
}) => {
    const [copied, setCopied] = useState(false);
    const [showSuccess, setShowSuccess] = useState(true);

    useEffect(() => {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(timer);
    }, [lesson]);


    const handleCopy = () => {
        const fullContent = elaboration ? `${lesson}\n\n${elaboration}` : lesson;
        navigator.clipboard.writeText(fullContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };
    
    const renderedLesson = useMemo(() => parseAndRenderLesson(lesson), [lesson]);
    const renderedElaboration = useMemo(() => elaboration ? parseAndRenderLesson(elaboration) : null, [elaboration]);

    return (
        <div dir="rtl" className="relative w-full bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl p-4 sm:p-6 md:p-8 animate-fade-in border border-gray-800">
            <button 
                onClick={handleCopy}
                className="absolute top-4 left-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 z-10"
                aria-label="Copy lesson to clipboard"
            >
                <ClipboardIcon className="w-5 h-5" />
            </button>
            
            {copied && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm font-bold py-3 px-6 rounded-full shadow-lg z-50 animate-fade-in">
                    ✅ تم نسخ الدرس إلى الحافظة!
                </div>
            )}
            
            {showSuccess && (
                <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-2 rounded-lg mb-6 text-center animate-fade-in" role="alert">
                    ✅ تم إنشاء الدرس بنجاح!
                </div>
            )}
            
            <div className="text-gray-200 text-right text-lg leading-relaxed space-y-4">
                {renderedLesson}
            </div>

            {/* Actions Section */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-700/50 text-center">
                
                {isElaborating && <LoadingSpinner />}
                {elaborationError && <ErrorMessage message={elaborationError} />}
                {elaboration && renderedElaboration && (
                    <div className="text-gray-200 text-right text-lg leading-relaxed space-y-4 animate-fade-in">
                        {renderedElaboration}
                    </div>
                )}

                {isGeneratingDiagram && <LoadingSpinner />}
                {diagramError && <ErrorMessage message={diagramError} />}
                {diagram && (
                     <div className="my-6 p-4 bg-gray-950 rounded-lg border border-gray-700 overflow-x-auto flex justify-center animate-fade-in">
                        <div key={diagram} className="mermaid">{diagram}</div>
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                    {!isElaborating && !elaboration && (
                        <button
                            onClick={onElaborate}
                            disabled={isElaborating}
                            className="bg-red-700 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center w-full sm:w-auto gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                               <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z M13.5 10.5h-6" />
                            </svg>
                            <span>شرح مفصل للأمثلة</span>
                        </button>
                    )}

                    {!isGeneratingDiagram && !diagram && (
                        <button
                            onClick={onGenerateDiagram}
                            disabled={isGeneratingDiagram}
                            className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center w-full sm:w-auto gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                            </svg>
                            <span>عرض القاعدة كمخطط</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonDisplay;