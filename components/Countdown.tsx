import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownProps {
    targetDate: string; // ISO format or date string
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                min: Math.floor((difference / 1000 / 60) % 60),
                seg: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!hasMounted) return null;

    const timerComponents: JSX.Element[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        const value = timeLeft[interval as keyof typeof timeLeft];

        if (value !== undefined) {
            timerComponents.push(
                <div key={interval} className="flex flex-col items-center mx-2">
                    <span className="text-2xl md:text-3xl font-bold font-mono text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] md:text-xs uppercase text-slate-300 font-semibold tracking-wider">
                        {interval}
                    </span>
                </div>
            );

            // Separator
            if (interval !== 'seg') {
                timerComponents.push(
                    <span key={`${interval}-sep`} className="text-lg md:text-2xl text-white/50 font-light -mt-4">:</span>
                );
            }
        }
    });

    if (!timerComponents.length) {
        return <span className="text-white font-bold">Oferta Encerrada!</span>;
    }

    return (
        <div className="flex flex-col items-center mt-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2 bg-red-600/20 border border-red-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <Timer size={14} className="text-red-400" />
                <span className="text-xs font-semibold text-red-200 uppercase tracking-widest">Oferta Expira em:</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                {timerComponents}
            </div>
        </div>
    );
};
