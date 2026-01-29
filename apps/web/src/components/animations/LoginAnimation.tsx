'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function LoginAnimation({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the login form on mount
      const card = containerRef.current?.querySelector('.login-card');
      const logo = containerRef.current?.querySelector('.login-logo');
      const inputs = containerRef.current?.querySelectorAll('.login-input-group');
      const button = containerRef.current?.querySelector('.login-submit');
      const footer = containerRef.current?.querySelector('.login-footer');

      // Safety check - if button exists, ensure it's visible
      if (button) {
        gsap.set(button, { opacity: 1, visibility: 'visible' });
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (logo) {
        tl.from(logo, {
          opacity: 0,
          y: -30,
          duration: 0.6,
        });
      }

      if (card) {
        tl.from(
          card,
          {
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.8,
          },
          '-=0.3'
        );
      }

      if (inputs && inputs.length > 0) {
        tl.from(
          inputs,
          {
            opacity: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.5,
          },
          '-=0.4'
        );
      }

      if (button) {
        tl.from(
          button,
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          '-=0.2'
        );
      }

      if (footer) {
        tl.from(
          footer,
          {
            opacity: 0,
            duration: 0.5,
          },
          '-=0.2'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="login-animation-wrapper">
      {children}
    </div>
  );
}
