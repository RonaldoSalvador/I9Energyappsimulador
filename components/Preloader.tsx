import React, { useEffect, useState } from 'react';
import { ASSETS } from '../constants/assets';

interface PreloaderProps {
    onFinish: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Wait for 2 seconds then start fade out
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for fade out animation to finish before unmounting
            setTimeout(onFinish, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="relative flex flex-col items-center">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-energisa-orange/20 blur-[100px] animate-pulse rounded-full"></div>

                {/* Logo with Breathing Animation */}
                <img
                    src={ASSETS.CHRISTMAS.LOGO_SANTA}
                    alt="Loading..."
                    className="w-48 md:w-64 h-auto object-contain relative z-10 animate-[bounce_2s_infinite]"
                    style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                />

                {/* Loading Indicator */}
                <div className="mt-8 flex gap-2">
                    <div className="w-3 h-3 bg-energisa-orange rounded-full animate-[bounce_1s_infinite_100ms]"></div>
                    <div className="w-3 h-3 bg-energisa-orange rounded-full animate-[bounce_1s_infinite_300ms]"></div>
                    <div className="w-3 h-3 bg-energisa-orange rounded-full animate-[bounce_1s_infinite_500ms]"></div>
                </div>
            </div>
        </div>
    );
};
