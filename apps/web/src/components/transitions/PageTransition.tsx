'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page enter animation
      gsap.from(transitionRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });
    }, transitionRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={transitionRef} className="page-transition-wrapper">
      {children}
    </div>
  );
}
