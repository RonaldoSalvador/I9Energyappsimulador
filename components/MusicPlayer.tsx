import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
    src: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Start muted but allow user to unmute/play
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = 0.3; // Start at 30% volume

            // Attempt Autoplay
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        console.log("Autoplay started successfully");
                    })
                    .catch((error) => {
                        console.log("Autoplay prevented by browser (user interaction required):", error);
                        setIsPlaying(false);
                    });
            }
        }
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Floating Music Button */}
            <button
                onClick={togglePlay}
                className={`
          relative group flex items-center justify-center w-12 h-12 rounded-full 
          shadow-lg backdrop-blur-md border border-white/20 transition-all duration-300
          ${isPlaying
                        ? 'bg-red-600/90 text-white shadow-red-500/30 scale-100'
                        : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white hover:scale-110'
                    }
        `}
            >
                {isPlaying ? (
                    <>
                        <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20"></span>
                        <Volume2 size={20} className="relative z-10" />
                    </>
                ) : (
                    <VolumeX size={20} />
                )}

                {/* Tooltip */}
                <span className="absolute right-full mr-3 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {isPlaying ? 'Pausar Música' : 'Tocar Música de Natal'}
                </span>
            </button>

            <audio ref={audioRef} src={src} loop />
        </div>
    );
};
