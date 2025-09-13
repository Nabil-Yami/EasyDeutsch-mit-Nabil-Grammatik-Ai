import React, { useState, useEffect, useRef } from 'react';
import type { Chat, GenerateContentResponse } from '@google/genai';
import { createChatSession } from '../services/geminiService';

interface ChatAssistantProps {
    topic: string;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);


const ChatAssistant: React.FC<ChatAssistantProps> = ({ topic }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize or reset chat when the topic changes
        const session = createChatSession(topic);
        setChatSession(session);
        setMessages([
            { role: 'model', text: `أهلاً بك! أنا هنا لمساعدتك في أي سؤال حول "${topic}". اسألني أي شيء بالعربية أو الألمانية.` }
        ]);
        setError(null);
    }, [topic]);

    useEffect(() => {
        // Auto-scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isReplying || !chatSession) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsReplying(true);
        setError(null);

        try {
            const response: GenerateContentResponse = await chatSession.sendMessage({ message: input });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "حدث خطأ غير متوقع.";
            setError("عذراً، لم أتمكن من الرد. الرجاء المحاولة مرة أخرى.");
            console.error("Chat error:", errorMessage);
            // Re-add user message to input if sending fails
            setInput(userMessage.text);
            setMessages(prev => prev.slice(0, -1)); // remove the optimistic user message
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <div dir="rtl" className="fixed bottom-4 right-4 z-50">
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-80 sm:w-96 h-[60vh] max-h-[500px]' : 'w-16 h-16'}`}>
                {/* Collapsed Button */}
                {!isOpen && (
                     <button
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-700 transition-transform transform hover:scale-110"
                        aria-label="Open chat assistant"
                    >
                        <ChatIcon className="w-8 h-8" />
                    </button>
                )}

                {/* Expanded Chat Window */}
                {isOpen && (
                    <div className="w-full h-full bg-gray-900 rounded-xl shadow-2xl flex flex-col border border-gray-700 animate-fade-in">
                        {/* Header */}
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-t-xl border-b border-gray-700">
                            <h3 className="font-bold text-white">مساعد الذكاء الاصطناعي</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close chat assistant">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] py-2 px-4 rounded-2xl ${
                                        msg.role === 'user' 
                                        ? 'bg-amber-700 text-white rounded-br-none' 
                                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                                    }`}>
                                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                             {isReplying && (
                                <div className="flex justify-start">
                                     <div className="max-w-[80%] py-2 px-4 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center gap-2">
                                        <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce"></span>
                                     </div>
                                </div>
                            )}
                            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-700">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="اسأل عن الدرس..."
                                    className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                                    disabled={isReplying}
                                />
                                <button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-2.5 rounded-full transition-colors"
                                    disabled={!input.trim() || isReplying}
                                    aria-label="Send message"
                                >
                                    <SendIcon className="w-5 h-5"/>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatAssistant;