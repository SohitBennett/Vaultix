'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function AnimatedHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation - split text reveal
      const titleChars = titleRef.current?.querySelectorAll('.char');
      if (titleChars) {
        gsap.from(titleChars, {
          opacity: 0,
          y: 100,
          rotateX: -90,
          stagger: 0.02,
          duration: 1,
          ease: 'power4.out',
          delay: 0.3,
        });
      }

      // Subtitle fade in
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8,
      });

      // Buttons stagger animation
      const buttons = buttonsRef.current?.querySelectorAll('.hero-btn');
      if (buttons) {
        gsap.from(buttons, {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          delay: 1.2,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={heroRef} className="claude-landing-hero-content">
      <h1 ref={titleRef} className="claude-landing-hero-title">
        {splitText('Secure password management')}
        <br />
        <span className="claude-landing-hero-title-accent">
          {splitText('made simple')}
        </span>
      </h1>
      <p ref={subtitleRef} className="claude-landing-hero-subtitle">
        Store your passwords with military-grade encryption. Zero-knowledge
        architecture means only you can access your data.
      </p>
      <div ref={buttonsRef} className="claude-landing-hero-buttons">
        <Link href="/register" className="claude-landing-hero-btn-primary hero-btn magnetic-btn">
          Create free account
        </Link>
        <Link href="/login" className="claude-landing-hero-btn-secondary hero-btn magnetic-btn">
          Sign in
        </Link>
      </div>
    </div>
  );
}
