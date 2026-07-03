'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LazyRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string | number;
}

export default function LazyRender({ children, fallback, minHeight = 200 }: LazyRenderProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load slightly before it scrolls into view
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} style={{ minHeight: visible ? 'auto' : minHeight, width: '100%' }}>
      {visible ? children : fallback}
    </div>
  );
}
