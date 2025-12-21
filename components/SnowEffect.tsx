import React, { useEffect, useRef } from 'react';

export const SnowEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; radius: number; speed: number; opacity: number }[] = [];
        const particleCount = 100; // Number of snowflakes

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 3 + 1, // Size variation
                speed: Math.random() * 1 + 0.5, // Speed variation
                opacity: Math.random() * 0.5 + 0.3, // Opacity variation
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();

            particles.forEach((p) => {
                ctx.moveTo(p.x, p.y);
                ctx.globalAlpha = p.opacity;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                // Update position
                p.y += p.speed;
                p.x += Math.sin(p.y * 0.01) * 0.5; // Slight sway

                // Reset if out of bounds
                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
                if (p.x > width) {
                    p.x = 0;
                } else if (p.x < 0) {
                    p.x = width;
                }
            });

            ctx.fill();
            requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
            style={{ opacity: 0.6 }}
        />
    );
};
