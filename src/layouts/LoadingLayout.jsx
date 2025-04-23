import React, { useEffect } from 'react';

function LoadingLayout() {
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <>
            <div className="bg-surface-a0 dark:bg-dark-surface-a0 min-h-screen transition-colors duration-300">
                <div className="flex items-center justify-center h-screen">
                    <svg
                        className="animate-spin h-10 w-10 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1h9a2.5 2.5 0 1 1-5 0h-4a2.5 2.5 0 0 1-4.5-1z"
                        ></path>
                    </svg>
                    <div>
                        <p className="text-green-500 ml-0.5">LOADING...</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoadingLayout;


