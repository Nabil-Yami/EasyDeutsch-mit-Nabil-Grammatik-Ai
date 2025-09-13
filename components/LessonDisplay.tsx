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
    onGenerateMindMap: () => void;
    isGeneratingMindMap: boolean;
    mindMap: string | null;
    mindMapError: string | null;
    onGenerateExercises: () => void;
    isGeneratingExercises: boolean;
    exercises: string | null;
    exercisesError: string | null;
}

const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.045m1.584 0c.386 1.11.238 2.403-.352 3.444M15.666 3.888L13.5 2.25m2.166 1.638a2.25 2.25 0 013.444-1.352L21 4.5m-4.134 1.638A2.25 2.25 0 0118 8.25v3.75a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-3.75a2.25 2.25 0 012.25-2.25h3.75m-3.75 0h-3.75a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-3.75m-3.75 0h.008v.015h-.008V5.25z" />
    </svg>
);

const iconClasses = "w-7 h-7 text-amber-400 flex-shrink-0";
const sectionIcons: { [key: string]: JSX.Element } = {
    "الشرح": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    "أمثلة": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-4.5 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    "ملخص": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    "جدول": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 6.75h17.25m-17.25 10.5h17.25M6.75 3.375h10.5m-10.5 17.25h10.5M3.375 10.125h17.25m-17.25 3.75h17.25M10.125 3.375v17.25m3.75-17.25v17.25" /></svg>,
    "ملاحظات": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
    "تحليل نحوي": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
    "خطأ شائع للمتحدثين بالعربية": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
    "تمارين": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>,
    "الحلول": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
};
const fallbackIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;

const parseAndRenderLesson = (lessonText: string) => {
    const mainContent: JSX.Element[] = [];
    let sectionElements: (JSX.Element | null)[] = [];
    let currentSectionTitle = '';

    const flushSection = () => {
        if (sectionElements.length > 0) {
            const titleKey = currentSectionTitle.replace(/:$/, '').replace(/\d+\..*$/, '').trim();
            
            let cardClasses = "bg-gray-900/50 rounded-lg p-4 sm:p-6 mb-6 border border-gray-700/50 shadow-lg";
            if (titleKey.includes("ملاحظات")) {
                 cardClasses = "bg-amber-950/30 rounded-lg p-4 sm:p-6 mb-6 border border-amber-800/50 shadow-lg";
            }
            
            mainContent.push(
                <div key={`section-wrapper-${mainContent.length}`} className={cardClasses}>
                    {sectionElements}
                </div>
            );
            sectionElements = [];
            currentSectionTitle = '';
        }
    }

    const lines = lessonText.split('\n');
    let isTable = false;
    let tableHeader: JSX.Element | null = null;
    let tableBodyRows: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];

    const flushTable = () => {
        if (tableHeader || tableBodyRows.length > 0) {
            sectionElements.push(
                <div key={`table-wrapper-${sectionElements.length}`} className="overflow-x-auto my-6 shadow-md rounded-lg border border-gray-700">
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

    const flushList = () => {
        if (listItems.length > 0) {
            const containsComplexItems = listItems.some(item => !item.props.className.includes('list-item'));
            if (containsComplexItems) {
                sectionElements.push(<div key={`list-container-${sectionElements.length}`} className="my-4 space-y-4">{listItems}</div>);
            } else {
                sectionElements.push(<ul key={`ul-${sectionElements.length}`} className="my-4 space-y-3 pr-5">{listItems}</ul>);
            }
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.trim() === '') return;

        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            flushList();
            if (!isTable) isTable = true;
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            if (cells.every(c => /^-{3,}$/.test(c.replace(/:/g, '')))) return;
            
            if (!tableHeader) {
                tableHeader = <tr key={`header-${index}`}>{cells.map((cell, i) => <th key={i} className="py-3 px-5 font-bold text-amber-300 border-b-2 border-gray-600 tracking-wider uppercase text-sm">{cell}</th>)}</tr>;
            } else {
                tableBodyRows.push(<tr key={`row-${index}`} className="hover:bg-amber-900/20 transition-colors">{cells.map((cell, i) => <td key={i} className="py-3 px-5 border-t border-gray-700">{cell}</td>)}</tr>);
            }
            return;
        } else if (isTable) {
            flushTable();
        }

        if (line.trim().startsWith('-')) {
            const text = line.trim().substring(1).trim();
            const exampleMatch = text.match(/^(.*?)\s*\((.*?)\)$/);
            
            if (exampleMatch) {
                const german = exampleMatch[1].trim();
                const arabic = exampleMatch[2].trim();
                listItems.push(
                    <li key={`li-ex-${index}`} className="list-none p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-md transition-all duration-300 hover:border-amber-400/50 hover:shadow-amber-500/10">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🇩🇪</span>
                                <p className="font-sans text-amber-300 text-lg font-medium" dir="ltr">{german}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🇦🇪</span>
                                <p className="text-gray-300 text-base" dir="rtl">{arabic}</p>
                            </div>
                        </div>
                    </li>
                );
            } else {
                listItems.push(
                    <li key={`li-simple-${index}`} className="text-gray-300 leading-loose list-disc list-item marker:text-amber-400">
                        {text}
                    </li>
                );
            }
            return;
        }

        flushList();
        flushTable();
        
        if (line.trim() === '---') {
            sectionElements.push(<hr key={`hr-${index}`} className="my-8 border-gray-700 border-dashed" />);
            return;
        }
        
        if (line.startsWith('###')) {
             flushSection();
            const text = line.replace(/###\s*\*\*/g, '').replace(/\*\*/g, '').trim();
            const emojiMatch = text.match(/^[🔍📜📝🔑]/);
            const emoji = emojiMatch ? emojiMatch[0] : '📜';
            const cleanText = text.replace(/^[🔍📜📝🔑]\s*/, '');
            sectionElements.push(<h2 key={index} className="text-2xl md:text-3xl font-bold text-amber-400 mt-2 mb-6 border-b-2 border-amber-500/30 pb-3 flex items-center">{emoji}<span className="mr-3">{cleanText}</span></h2>);
            return;
        }
        
        const subheadingMatch = line.match(/^\s*\*\*(.*?)\*\*/);
        if (subheadingMatch) {
            flushSection();
            const fullTitle = subheadingMatch[1];
            currentSectionTitle = fullTitle;
            const titleKeyMatch = fullTitle.match(/حلول|تمرين|ملاحظات/i);
            const titleKey = titleKeyMatch ? (titleKeyMatch[0].toLowerCase().includes('حلول') ? 'الحلول' : titleKeyMatch[0].toLowerCase().includes('تمرين') ? 'تمارين' : 'ملاحظات') : fullTitle.replace(/\d+\.\s*/, '').trim().replace(/:$/, '');

            const icon = sectionIcons[titleKey] || fallbackIcon;
            sectionElements.push(
                <h3 key={index} className="text-xl md:text-2xl font-semibold text-gray-100 mb-4 flex items-center gap-3">
                    {icon}
                    <span>{fullTitle}</span>
                </h3>
            );
            return;
        }
        
        const highlightedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-semibold">$1</strong>');
        sectionElements.push(<p key={index} className="my-2 text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightedLine }}></p>);
    });

    flushList();
    flushTable();
    flushSection();

    return mainContent;
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
    onGenerateMindMap,
    isGeneratingMindMap,
    mindMap,
    mindMapError,
    onGenerateExercises,
    isGeneratingExercises,
    exercises,
    exercisesError,
}) => {
    const [copied, setCopied] = useState(false);
    const [showSuccess, setShowSuccess] = useState(true);

    useEffect(() => {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(timer);
    }, [lesson]);

    useEffect(() => {
        if (diagram || mindMap) {
             // The mermaid global comes from the script tag in index.html
            // @ts-ignore
            if (window.mermaid) {
                try {
                    // @ts-ignore
                    window.mermaid.run();
                } catch(e) {
                    console.error("Failed to render mermaid diagram", e);
                }
            }
        }
    }, [diagram, mindMap]);


    const handleCopy = () => {
        const fullContent = elaboration ? `${lesson}\n\n${elaboration}` : lesson;
        navigator.clipboard.writeText(fullContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };
    
    const renderedLesson = useMemo(() => parseAndRenderLesson(lesson), [lesson]);
    const renderedElaboration = useMemo(() => elaboration ? parseAndRenderLesson(elaboration) : null, [elaboration]);
    const renderedExercises = useMemo(() => exercises ? parseAndRenderLesson(exercises) : null, [exercises]);

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
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-8 tracking-wide filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]">{topic}</h1>

            <div className="text-gray-200 text-right text-lg leading-relaxed">
                {renderedLesson}
            </div>

            {/* Actions Section */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-700/50">
                
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
                        <div className="mermaid">{diagram}</div>
                    </div>
                )}

                {isGeneratingMindMap && <LoadingSpinner />}
                {mindMapError && <ErrorMessage message={mindMapError} />}
                {mindMap && (
                     <div className="my-6 p-4 bg-gray-950 rounded-lg border border-gray-700 overflow-x-auto flex justify-center animate-fade-in">
                        <div className="mermaid">{mindMap}</div>
                    </div>
                )}

                {isGeneratingExercises && <LoadingSpinner />}
                {exercisesError && <ErrorMessage message={exercisesError} />}
                {exercises && renderedExercises && (
                     <div className="mt-6 pt-6 border-t border-gray-700 text-gray-200 text-right text-lg leading-relaxed space-y-4 animate-fade-in">
                        {renderedExercises}
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 text-center">
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

                    {!isGeneratingMindMap && !mindMap && (
                        <button
                            onClick={onGenerateMindMap}
                            disabled={isGeneratingMindMap}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center w-full sm:w-auto gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.125-1.5M12 16.5v2.25m0 0l1.125 1.5m-1.125-1.5l-1.125 1.5M3.75 12h16.5m-16.5 0l1.125-1.5m14.25 1.5l-1.125-1.5M3.75 12l-1.125-1.5m16.5 1.5l1.125-1.5" />
                            </svg>
                            <span>إنشاء خريطة ذهنية</span>
                        </button>
                    )}

                    {!isGeneratingExercises && !exercises && (
                        <button
                            onClick={onGenerateExercises}
                            disabled={isGeneratingExercises}
                            className="bg-sky-700 hover:bg-sky-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center w-full sm:w-auto gap-2"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            <span>إنشاء تمارين</span>
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LessonDisplay;