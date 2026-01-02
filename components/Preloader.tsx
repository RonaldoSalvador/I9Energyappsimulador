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
                    src="https://lqwywrknndolrxvmyuna.supabase.co/storage/v1/object/sign/arquivos%20da%20empresa/Gemini_Generated_Image_iogyo7iogyo7iogynova%20logo%20i9enrgy%20oficial%20(1)sem%20fundo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85Y2EzZmYzMC1jYjNlLTRjZGUtOGM2MC0yYzA2ZGNlODM0ZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcnF1aXZvcyBkYSBlbXByZXNhL0dlbWluaV9HZW5lcmF0ZWRfSW1hZ2VfaW9neW83aW9neW83aW9neW5vdmEgbG9nbyBpOWVucmd5IG9maWNpYWwgKDEpc2VtIGZ1bmRvLnBuZyIsImlhdCI6MTc2NzM2Njc5NSwiZXhwIjoyMDgyNzI2Nzk1fQ.I92lFt8hmKcxZnv44Tqz9wQpU-DkCgDNeiphDNG-Zhs"
                    alt="Loading..."
                    className="w-48 md:w-64 h-auto object-contain relative z-10 animate-pulse"
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
