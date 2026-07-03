'use client';

import React from 'react';
import PulseLine from '@/components/ui/pulse-line';
import styles from './style.module.css';

export default function ChatbotBubble() {
  return (
    <button
      className={styles.bubble}
      aria-label="Chat with PE assistant"
    >
      <PulseLine className={styles.pulseLine} />
    </button>
  );
}
