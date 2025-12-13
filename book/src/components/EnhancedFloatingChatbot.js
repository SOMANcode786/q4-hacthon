import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import EnhancedChatbot from './EnhancedChatbot';
import styles from './EnhancedFloatingChatbot.module.css';

const EnhancedFloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Show notification badge when there are unread messages
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShowNotification(false);
    }
  }, [isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Add slight delay to allow opening animation to complete
      setTimeout(() => {
        // Focus on input when chat opens
        const input = document.querySelector(`.${styles.chatInput}`);
        if (input) {
          setTimeout(() => input.focus(), 300);
        }
      }, 100);
    }
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  // Function to trigger unread notification (could be called when new messages arrive)
  const triggerNotification = () => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
      setShowNotification(true);
      // Auto-hide notification after 5 seconds if chat is still closed
      setTimeout(() => {
        if (!isOpen) {
          setShowNotification(false);
        }
      }, 5000);
    }
  };

  return (
    <BrowserOnly>
      {() => (
        <div className={styles.floatingChatbot}>
          {isOpen ? (
            <div className={`${styles.chatbotContainer} ${styles.openAnimation}`}>
              <div className={styles.chatbotHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>AI Assistant</span>
                  {showNotification && unreadCount > 0 && (
                    <span className={styles.notificationBadge}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={styles.minimizeButton}
                    onClick={toggleChatbot}
                    aria-label="Minimize chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <button
                    className={styles.closeButton}
                    onClick={closeChatbot}
                    aria-label="Close chat"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.chatbotBody}>
                <EnhancedChatbot onNewMessage={triggerNotification} />
              </div>
            </div>
          ) : (
            <button
              className={styles.fab}
              onClick={toggleChatbot}
              aria-label="Open chat"
              title="Open AI Assistant"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
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
              {showNotification && unreadCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
        </div>
      )}
    </BrowserOnly>
  );
};

export default EnhancedFloatingChatbot;