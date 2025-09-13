import React from 'react';
import { useState, useCallback } from 'react';
import Header from './components/Header';
import TopicInput from './components/TopicInput';
import LessonDisplay from './components/LessonDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { generateGermanGrammarLesson, elaborateOnExamples, generateDiagram, generateMindMap } from './services/geminiService';

const App: React.FC = () => {
    const [lesson, setLesson] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTopic, setCurrentTopic] = useState<string | null>(null);
    const [elaboration, setElaboration] = useState<string | null>(null);
    const [isElaborating, setIsElaborating] = useState<boolean>(false);
    const [elaborationError, setElaborationError] = useState<string | null>(null);
    const [diagram, setDiagram] = useState<string | null>(null);
    const [isGeneratingDiagram, setIsGeneratingDiagram] = useState<boolean>(false);
    const [diagramError, setDiagramError] = useState<string | null>(null);
    const [mindMap, setMindMap] = useState<string | null>(null);
    const [isGeneratingMindMap, setIsGeneratingMindMap] = useState<boolean>(false);
    const [mindMapError, setMindMapError] = useState<string | null>(null);

    const handleGenerateLesson = useCallback(async (topic: string) => {
        if (!topic.trim()) {
            setError("الرجاء إدخال موضوع لإنشاء درس عنه.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setLesson(null);
        setElaboration(null);
        setElaborationError(null);
        setDiagram(null);
        setDiagramError(null);
        setMindMap(null);
        setMindMapError(null);
        setCurrentTopic(topic);
        
        try {
            const generatedLesson = await generateGermanGrammarLesson(topic);
            setLesson(generatedLesson);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("حدث خطأ غير متوقع.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleElaborate = useCallback(async () => {
        if (!lesson || !currentTopic) return;

        setIsElaborating(true);
        setElaborationError(null);
        try {
            const generatedElaboration = await elaborateOnExamples(currentTopic, lesson);
            setElaboration(generatedElaboration);
        } catch (e) {
            if (e instanceof Error) {
                setElaborationError(e.message);
            } else {
                setElaborationError("حدث خطأ غير متوقع أثناء شرح الأمثلة.");
            }
        } finally {
            setIsElaborating(false);
        }
    }, [lesson, currentTopic]);

    const handleGenerateDiagram = useCallback(async () => {
        if (!currentTopic) return;

        setIsGeneratingDiagram(true);
        setDiagramError(null);
        setDiagram(null);
        try {
            const generatedDiagram = await generateDiagram(currentTopic);
            setDiagram(generatedDiagram);
        } catch (e) {
            if (e instanceof Error) {
                setDiagramError(e.message);
            } else {
                setDiagramError("حدث خطأ غير متوقع أثناء إنشاء المخطط.");
            }
        } finally {
            setIsGeneratingDiagram(false);
        }
    }, [currentTopic]);

    const handleGenerateMindMap = useCallback(async () => {
        if (!currentTopic) return;

        setIsGeneratingMindMap(true);
        setMindMapError(null);
        setMindMap(null);
        try {
            const generatedMindMap = await generateMindMap(currentTopic);
            setMindMap(generatedMindMap);
        } catch (e) {
            if (e instanceof Error) {
                setMindMapError(e.message);
            } else {
                setMindMapError("حدث خطأ غير متوقع أثناء إنشاء الخريطة الذهنية.");
            }
        } finally {
            setIsGeneratingMindMap(false);
        }
    }, [currentTopic]);

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center">
            <Header />
            <main className="w-full max-w-4xl flex flex-col items-center p-4 sm:p-6 lg:p-8">
                <TopicInput onGenerate={handleGenerateLesson} isLoading={isLoading} />
                <div className="w-full mt-8">
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorMessage message={error} />}
                    {lesson && currentTopic && (
                        <LessonDisplay
                            lesson={lesson}
                            topic={currentTopic}
                            onElaborate={handleElaborate}
                            isElaborating={isElaborating}
                            elaboration={elaboration}
                            elaborationError={elaborationError}
                            onGenerateDiagram={handleGenerateDiagram}
                            isGeneratingDiagram={isGeneratingDiagram}
                            diagram={diagram}
                            diagramError={diagramError}
                            onGenerateMindMap={handleGenerateMindMap}
                            isGeneratingMindMap={isGeneratingMindMap}
                            mindMap={mindMap}
                            mindMapError={mindMapError}
                         />
                    )}
                    {!isLoading && !error && !lesson && (
                         <div className="text-center text-gray-400 p-8 bg-gray-900/50 rounded-lg">
                            <h2 className="text-xl font-bold mb-2">مساعدك لتعلم قواعد اللغة الألمانية</h2>
                            <p>اختر أحد المواضيع المقترحة أو اكتب موضوعًا في قواعد اللغة الألمانية لبدء التعلم.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;