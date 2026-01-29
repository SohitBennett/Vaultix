'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Client-side encryption',
    description:
      'Your passwords are encrypted in your browser before being sent to our servers. We never see your data.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
    title: 'Password generator',
    description:
      'Generate cryptographically secure passwords with customizable length and character sets.',
    link: '/generator',
    linkText: 'Try generator →',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'Easy export',
    description:
      'Export your passwords to CSV anytime. Your data is always yours to keep.',
  },
];

export function AnimatedFeatures() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = featuresRef.current?.querySelectorAll('.feature-card');
      
      if (cards) {
        cards.forEach((card, index) => {
          // Scroll-triggered animation
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 60,
            rotateX: -15,
            duration: 1,
            ease: 'power3.out',
            delay: index * 0.15,
          });

          // Hover animation
          const handleMouseEnter = () => {
            gsap.to(card, {
              y: -10,
              scale: 1.02,
              duration: 0.4,
              ease: 'power2.out',
            });
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
            });
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);

          return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
          };
        });
      }
    }, featuresRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={featuresRef} className="claude-landing-features">
      {features.map((feature, index) => (
        <div key={index} className="claude-landing-feature-card feature-card">
          <div className="claude-landing-feature-icon">{feature.icon}</div>
          <h3 className="claude-landing-feature-title">{feature.title}</h3>
          <p className="claude-landing-feature-description">{feature.description}</p>
          {feature.link && (
            <Link href={feature.link} className="claude-landing-feature-link">
              {feature.linkText}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
