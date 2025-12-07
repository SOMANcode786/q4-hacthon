import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Chatbot from './Chatbot';
import styles from './FloatingChatbot.module.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <BrowserOnly>
      {() => (
        <div className={styles.floatingChatbot}>
          {isOpen ? (
            <div className={styles.chatbotContainer}>
              <div className={styles.chatbotHeader}>
                <span>AI Assistant</span>
                <button
                  className={styles.closeButton}
                  onClick={toggleChatbot}
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>
              <div className={styles.chatbotBody}>
                <Chatbot />
              </div>
            </div>
          ) : (
            <button
              className={styles.fab}
              onClick={toggleChatbot}
              aria-label="Open chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.icon}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}
        </div>
      )}
    </BrowserOnly>
  );
};

export default FloatingChatbot;