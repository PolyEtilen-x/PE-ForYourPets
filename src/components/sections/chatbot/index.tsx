'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useChatbotQuery } from '@/queries/useChatbotQuery';
import { useChatbotMutation } from '@/queries/useChatbotMutation';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import styles from './style.module.css';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatbotBubble() {
  const t = useTranslations('chatbot');
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  
  // Deterministic message counter for unique, pure IDs
  const msgIdCounter = useRef(0);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: t('welcome'),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Queries & Mutations
  const { data: suggestedQuestions } = useChatbotQuery();
  const askMutation = useChatbotMutation();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, askMutation.isPending]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || askMutation.isPending) return;

    msgIdCounter.current += 1;
    const userMsgId = `msg-user-${msgIdCounter.current}`;
    const newMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
    };
    
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Trigger API call
    askMutation.mutate(textToSend, {
      onSuccess: (reply) => {
        msgIdCounter.current += 1;
        const botMsgId = `msg-bot-${msgIdCounter.current}`;
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: reply,
          },
        ]);
      },
      onError: () => {
        msgIdCounter.current += 1;
        const botMsgId = `msg-bot-${msgIdCounter.current}`;
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: 'Có lỗi kết nối xảy ra. Vui lòng kiểm tra lại kết nối mạng của bạn hoặc thử lại sau!',
          },
        ]);
      },
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.bubble} ${isOpen ? styles.bubbleOpen : ''}`}
        aria-label="Chat with PE assistant"
      >
        {isOpen ? <X size={24} className={styles.iconX} /> : <MessageSquare size={24} className={styles.iconMsg} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.botProfile}>
              <div className={styles.avatar}>
                <Bot size={20} />
                <span className={styles.statusBadge} />
              </div>
              <div>
                <h3 className={styles.title}>{t('title')}</h3>
                <p className={styles.subtitle}>{t('subtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.sender === 'user' ? styles.rowUser : styles.rowBot
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className={styles.msgAvatar}>
                    <Bot size={14} />
                  </div>
                )}
                <div className={styles.bubbleText}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Suggested Question Pills (only show at start of conversation or as helper options) */}
            {suggestedQuestions && suggestedQuestions.length > 0 && (
              <div className={styles.suggestionsContainer}>
                {suggestedQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSend(q.question)}
                    className={styles.suggestionPill}
                    disabled={askMutation.isPending}
                  >
                    <Sparkles size={12} className={styles.sparkleIcon} />
                    {q.question}
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {askMutation.isPending && (
              <div className={`${styles.messageRow} ${styles.rowBot}`}>
                <div className={styles.msgAvatar}>
                  <Bot size={14} />
                </div>
                <div className={`${styles.bubbleText} ${styles.typingBubble}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className={styles.inputArea}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('placeholder')}
              className={styles.input}
              maxLength={1000}
              disabled={askMutation.isPending}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!inputVal.trim() || askMutation.isPending}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
