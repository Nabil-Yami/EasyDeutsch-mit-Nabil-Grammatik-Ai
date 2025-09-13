
import React from 'react';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div dir="rtl" className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative animate-fade-in" role="alert">
            <strong className="font-bold">حدث خطأ: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default ErrorMessage;
