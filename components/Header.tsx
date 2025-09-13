import React from 'react';

interface HeaderProps {
    onLogout: () => void;
    userName: string | null;
}

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onLogout, userName }) => {
    return (
        <header className="w-full flex justify-center py-6 md:py-10 relative overflow-hidden bg-gray-950">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full opacity-10 blur-[80px] animate-pulse"></div>
            
             <div className="w-full max-w-4xl flex justify-between items-center px-4 sm:px-6 lg:px-8">
                <div className="flex-1"></div> {/* Spacer */}
                <div className="text-center relative z-10 flex-shrink-0">
                     <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]">
                        EasyDeutsch mit Nabil
                    </h1>
                </div>
                <div className="flex-1 flex justify-end items-center gap-4" dir="ltr">
                    {userName && (
                        <span className="hidden sm:block text-gray-300" dir="rtl">
                           مرحباً، <span className="font-bold text-white">{userName.split(' ')[0]}</span>
                        </span>
                    )}
                    <button 
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-red-700 text-gray-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 border border-gray-700 hover:border-red-600"
                        aria-label="تسجيل الخروج"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">خروج</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;