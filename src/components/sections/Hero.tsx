"use client";

import { useRef, useState } from "react";
import { HERO } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function Hero() {
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
    <section className="pt-[calc(70px+2rem)] pb-12 md:pt-[calc(70px+4rem)] md:pb-20 bg-gradient-to-br from-gray-50 to-offwhite">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left">
            <h1
              className="font-heading text-3xl md:text-5xl font-bold text-firefly leading-tight mb-6 animate-hero-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              {HERO.headline.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p
              className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed animate-hero-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              Tribes<sup className="text-xs align-super">™</sup> makes it simple to connect with neighbors, share resources and skills, and build thriving communities.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start animate-hero-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button href="#final-cta" size="large">
                {HERO.cta}
              </Button>
            </div>

            <p
              className="text-sm text-gray-500 animate-hero-fade-up"
              style={{ animationDelay: "0.55s" }}
            >
              {HERO.trust.prefix}{" "}
              <span className="font-bold text-firefly">{HERO.trust.number}</span>{" "}
              {HERO.trust.suffix}
            </p>
          </div>

          {/* Demo Video */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl animate-hero-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <video
              ref={videoRef}
              className="block w-full"
              src="https://assets.cdn.filesafe.space/U5e1EQQhkA9AaPpvfXQt/media/69a7752eb701feefe371653d.mp4"
              playsInline
              muted
              autoPlay
              loop
              preload="metadata"
              aria-label="Tribes platform demo video"
              onClick={togglePlay}
              style={{ cursor: "pointer" }}
            />

            {/* Floating controls */}
            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-casablanca focus-visible:outline-offset-2"
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
