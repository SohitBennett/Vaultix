'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function AnimatedHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.from(logoRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1,
      });

      const buttons = buttonsRef.current?.querySelectorAll('a, button');
      if (buttons) {
        gsap.from(buttons, {
          opacity: 0,
          y: -20,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.3,
        });
      }

      // Header hide/show on scroll
      let lastScroll = 0;
      
      ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          const currentScroll = self.scroll();
          
          if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            gsap.to(headerRef.current, {
              y: -100,
              duration: 0.3,
              ease: 'power2.out',
            });
          } else {
            // Scrolling up
            gsap.to(headerRef.current, {
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
          
          lastScroll = currentScroll;
        },
      });

      // Background blur on scroll
      ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          const progress = Math.min(self.scroll() / 100, 1);
          if (headerRef.current) {
            headerRef.current.style.backdropFilter = `blur(${progress * 10}px)`;
            headerRef.current.style.backgroundColor = `rgba(255, 255, 255, ${progress * 0.8})`;
          }
        },
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className="claude-landing-header fixed top-0 left-0 right-0 z-50">
      <nav className="claude-landing-nav">
        <Link ref={logoRef} href="/" className="claude-landing-logo">
          <svg className="claude-landing-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="claude-landing-logo-text">Vaultix</span>
        </Link>
        <div ref={buttonsRef} className="claude-landing-nav-buttons">
          <ThemeToggle />
          <Link href="/login" className="claude-landing-btn-secondary">
            Sign in
          </Link>
          <Link href="/register" className="claude-landing-btn-primary">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
