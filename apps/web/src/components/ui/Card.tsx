import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div
            className={`
                bg-white dark:bg-white/5 border border-black/5 dark:border-white/10
                rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-calm
                ${className}
            `}
        >
            {children}
        </div>
    );
};
