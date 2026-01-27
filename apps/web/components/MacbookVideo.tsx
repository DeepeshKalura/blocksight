"use client"
import { motion, AnimatePresence } from "motion/react";
import {
    MediaPlayer,
    MediaProvider,
    useMediaState,
    useMediaRemote,
} from "@vidstack/react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import { Safari } from "./ui/safari";
import { useState, useRef, useEffect } from "react";
import "@vidstack/react/player/styles/base.css";

export function MacbookVideo() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Safari url="https://blocksight.dev/" className="size-full">
                <div className="relative w-full h-full bg-black group">
                    <MediaPlayer
                        src="/blocksight.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full"
                    >
                        <MediaProvider />
                        <VideoControls isHovering={isHovering} />
                    </MediaPlayer>
                </div>
            </Safari>
        </motion.div>
    );
}

function VideoControls({ isHovering }: { isHovering: boolean }) {
    const remote = useMediaRemote();
    const isPaused = useMediaState("paused");
    const isMuted = useMediaState("muted");
    const currentTime = useMediaState("currentTime");
    const duration = useMediaState("duration");
    const canFullscreen = useMediaState("canFullscreen");
    const isFullscreen = useMediaState("fullscreen");

    // Local state for smooth seeking visual
    const [seekValue, setSeekValue] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    // Sync seekbar with video time when not seeking
    useEffect(() => {
        if (!isSeeking && duration > 0) {
            setSeekValue((currentTime / duration) * 100);
        }
    }, [currentTime, duration, isSeeking]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeekStart = () => {
        setIsSeeking(true);
        remote.pause(); // Optional: pause while dragging
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setSeekValue(newValue);
        // Live seek
        if (duration > 0) {
            remote.seek((newValue / 100) * duration);
        }
    };

    const handleSeekEnd = () => {
        setIsSeeking(false);
        remote.play();
    };

    return (
        <>
            {/* Click to play/pause */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={() => isPaused ? remote.play() : remote.pause()}
            />

            {/* Controls Overlay */}
            <AnimatePresence>
                {(isHovering || isPaused) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex flex-col justify-end p-6 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none"
                    >
                        <div className="flex flex-col gap-2 pointer-events-auto">
                            {/* Custom Progress Bar */}
                            <div className="relative w-full h-1 bg-white/20 rounded-full group/progress cursor-pointer">
                                {/* Track Fill */}
                                <div
                                    className="absolute top-0 left-0 h-full bg-accent rounded-full"
                                    style={{ width: `${seekValue}%` }}
                                />
                                {/* Thumb */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
                                    style={{ left: `${seekValue}%`, transform: `translate(-50%, -50%)` }}
                                />
                                {/* Hidden Input for Interaction */}
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={seekValue}
                                    onMouseDown={handleSeekStart}
                                    onChange={handleSeekChange}
                                    onMouseUp={handleSeekEnd}
                                    onTouchStart={handleSeekStart}
                                    onTouchEnd={handleSeekEnd}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); isPaused ? remote.play() : remote.pause(); }}
                                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                    >
                                        {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                                    </button>

                                    <div className="flex items-center gap-2 relative">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); isMuted ? remote.unmute() : remote.mute(); }}
                                            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                        >
                                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>
                                    </div>

                                    <span className="text-white/80 text-sm font-medium">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                {canFullscreen && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); isFullscreen ? remote.exitFullscreen() : remote.enterFullscreen(); }}
                                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                    >
                                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Center Play Button (only when paused) */}
            <AnimatePresence>
                {
                    isPaused && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                                <Play size={32} fill="currentColor" className="text-white ml-1" />
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </>
    );
}
