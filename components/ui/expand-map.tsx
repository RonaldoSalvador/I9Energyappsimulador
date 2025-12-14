"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

interface LocationMapProps {
    location?: string
    coordinates?: string
    className?: string
    onSelect?: () => void
    isSelected?: boolean
    mapImage?: string // Optional background image if we want to replace the SVG maps
}

export function LocationMap({
    location = "Minas Gerais",
    coordinates = "CEMIG",
    className,
    onSelect,
    isSelected = false
}: LocationMapProps) {
    const [isHovered, setIsHovered] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
    const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])

    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
        setIsHovered(false)
    }

    const handleClick = () => {
        if (onSelect) onSelect();
    }

    // Expanded is controlled by selection effectively in this context, 
    // or we can keep it as a pure hover/click effect. 
    // For the simulator, "Expanded" might look good when selected.
    const isExpanded = isSelected;

    return (
        <motion.div
            ref={containerRef}
            className={`relative cursor-pointer select-none ${className}`}
            style={{
                perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <motion.div
                className={`relative overflow-hidden rounded-2xl bg-slate-800 border transition-colors duration-300 ${isSelected ? 'border-energisa-orange ring-2 ring-energisa-orange/20' : 'border-white/10 hover:border-white/20'}`}
                style={{
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: "preserve-3d",
                }}
                animate={{
                    // Fixed size for the cards in the grid
                    width: "100%",
                    height: 240,
                    scale: isSelected ? 1.02 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                }}
            >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 via-transparent to-slate-900/40" />

                <AnimatePresence>
                    {/* Always show map for this use case, or maybe only when expanded? 
              User asked for "Swap with this animation". 
              Let's keep the map visible but animated.
           */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="absolute inset-0 bg-slate-900/50" />

                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            {/* Main roads */}
                            <motion.line
                                x1="0%" y1="35%" x2="100%" y2="35%"
                                className="stroke-slate-600/30" strokeWidth="4"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
                            />
                            <motion.line
                                x1="0%" y1="65%" x2="100%" y2="65%"
                                className="stroke-slate-600/30" strokeWidth="4"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4 }}
                            />

                            {/* Vertical roads */}
                            <motion.line
                                x1="30%" y1="0%" x2="30%" y2="100%"
                                className="stroke-slate-600/20" strokeWidth="3"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.3 }}
                            />

                            {/* Secondary streets */}
                            {[20, 50, 80].map((y, i) => (
                                <motion.line key={`h-${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                                    className="stroke-slate-600/10" strokeWidth="1.5"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                                />
                            ))}
                        </svg>

                        {/* Buildings / POIs */}
                        {[
                            { t: '40%', l: '10%', w: '15%', h: '20%' },
                            { t: '15%', l: '35%', w: '12%', h: '15%' },
                            { t: '60%', l: '70%', w: '20%', h: '15%' },
                        ].map((b, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-sm bg-slate-500/20 border border-slate-500/10"
                                style={{ top: b.t, left: b.l, width: b.w, height: b.h }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            />
                        ))}

                        {/* Pin */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: isSelected ? 1.2 : 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
                        >
                            <svg
                                width="48" height="48" viewBox="0 0 24 24" fill="none"
                                className="drop-shadow-lg"
                                style={{ filter: isSelected ? "drop-shadow(0 0 15px rgba(255, 120, 30, 0.6))" : "drop-shadow(0 0 10px rgba(52, 211, 153, 0.2))" }}
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                    fill={isSelected ? "#FF781E" : "#34D399"}
                                    className="transition-colors duration-300" />
                                <circle cx="12" cy="9" r="2.5" className="fill-slate-900" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg backdrop-blur-md transition-all ${isSelected ? 'bg-energisa-orange/20 text-energisa-orange' : 'bg-white/5 text-slate-400'}`}>
                            {isSelected ? (
                                <div className="w-2 h-2 rounded-full bg-energisa-orange animate-pulse"></div>
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                            )}
                        </div>
                    </div>

                    <div>
                        <motion.h3
                            className={`font-bold text-2xl tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}
                            animate={{ x: isHovered ? 4 : 0 }}
                        >
                            {location}
                        </motion.h3>
                        <p className={`text-sm font-medium mt-1 ${isSelected ? 'text-energisa-orange' : 'text-slate-500'}`}>
                            {coordinates}
                        </p>
                    </div>
                </div>

            </motion.div>
        </motion.div>
    )
}
