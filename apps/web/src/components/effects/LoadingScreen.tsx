'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate progress bar
      gsap.to(progressRef.current, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
          // Fade out loading screen
          gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              setIsLoading(false);
            },
          });
        },
      });

      // Pulse animation for text
      gsap.to(textRef.current, {
        scale: 1.05,
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
      });
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  if (!isLoading) return null;

  return (
    <div
      ref={loaderRef}
      className="loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color, #ffffff)',
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Logo */}
      <svg
        className="w-16 h-16 mb-8 text-gray-900 dark:text-gray-100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>

      {/* Loading Text */}
      <div
        ref={textRef}
        className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
        style={{ letterSpacing: '-0.01em' }}
      >
        Vaultix
      </div>

      {/* Progress Bar */}
      <div
        className="progress-container"
        style={{
          width: '200px',
          height: '3px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          ref={progressRef}
          className="progress-bar"
          style={{
            height: '100%',
            width: '0%',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
}
