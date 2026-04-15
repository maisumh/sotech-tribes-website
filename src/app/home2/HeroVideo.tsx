"use client";

import { useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="relative rounded-[3px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(16,55,48,0.35)]">
      <video
        ref={videoRef}
        className="block w-full"
        src="https://assets.cdn.filesafe.space/U5e1EQQhkA9AaPpvfXQt/media/69d170ade69febb68fba12ee.mp4"
        playsInline
        muted
        autoPlay
        loop
        preload="metadata"
        aria-label="Tribes platform demo video"
        onClick={togglePlay}
        style={{ cursor: "pointer" }}
      />
      <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-casablanca focus-visible:outline-offset-2"
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-casablanca focus-visible:outline-offset-2"
        >
          {isMuted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
