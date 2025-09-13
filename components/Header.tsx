import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="w-full flex justify-center py-6 md:py-10 relative overflow-hidden bg-gray-950">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full opacity-10 blur-[80px] animate-pulse"></div>
            
             <div className="w-full max-w-4xl flex justify-center items-center px-4 sm:px-6 lg:px-8">
                <div className="text-center relative z-10">
                     <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]">
                        EasyDeutsch mit Nabil
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;