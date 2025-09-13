import React, { useState } from 'react';

interface LoginProps {
    onLoginSuccess: (name: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!name.trim() || !email.trim()) {
            setError("الرجاء إدخال الاسم والبريد الإلكتروني.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("الرجاء إدخال بريد إلكتروني صحيح.");
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            onLoginSuccess(name, email);
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 text-white">
            <div dir="rtl" className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-gray-900 rounded-xl shadow-2xl animate-fade-in">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]">
                        EasyDeutsch mit Nabil
                    </h1>
                    <p className="mt-2 text-gray-400">
                        مرحباً بك! أدخل معلوماتك للبدء.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            الاسم الكامل
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                            placeholder="مثال: نبيل أحمد"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                            placeholder="example@email.com"
                        />
                    </div>
                    
                    {error && (
                         <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm" role="alert">
                           {error}
                         </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
                        >
                            {isSubmitting ? 'جاري الدخول...' : 'ابدأ التعلم'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;