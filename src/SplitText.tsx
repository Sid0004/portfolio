import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.split-letter');
    if (!elements || elements.length === 0) return;
    gsap.set(elements, from);
    gsap.to(elements, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      onComplete: onLetterAnimationComplete,
    });
  }, [text, delay, duration, ease, from, to, onLetterAnimationComplete]);

  let parts: string[] = [];
  if (splitType === 'words') {
    parts = text.split(' ');
  } else {
    parts = text.split('');
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: 'inline-block', textAlign }}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className="split-letter"
          style={{ display: 'inline-block', whiteSpace: splitType === 'words' ? 'pre' : undefined }}
        >
          {part === ' ' ? '\u00A0' : part}
        </span>
      ))}
    </div>
  );
};

export default SplitText; 