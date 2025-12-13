import React, { useState, useEffect, useRef } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './EnhancedChatbot.module.css';

const EnhancedChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setShowScrollButton(!atBottom);
    }
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the backend API to get the response
      const response = await fetch('http://localhost:8000/api/rag/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversation_id: 'default_conversation',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessage = (text) => {
    // Convert markdown-like formatting to HTML
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');

    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return { __html: formatted };
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <div className={styles.chatbotHeaderIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h3 className={styles.chatbotHeaderTitle}>AI Assistant</h3>
          <p className={styles.chatbotHeaderSubtitle}>Physical AI & Humanoid Robotics</p>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className={styles.chatbotMessages}
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className={styles.chatbotWelcome}>
            <p>Welcome to the AI Assistant</p>
            <p>Ask me anything about Physical AI & Humanoid Robotics</p>
            <p>I can help explain concepts, provide examples, and answer questions from the course content.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.chatMessage} ${styles[`${message.sender}Message`]}`}
            >
              <div className={styles.messageContent}>
                <div dangerouslySetInnerHTML={formatMessage(message.text)} />
                {message.sources && message.sources.length > 0 && (
                  <div className={styles.messageSources}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <small>Sources: {message.sources.slice(0, 2).join(', ')}</small>
                  </div>
                )}
                <div className={styles.messageTimestamp}>
                  {message.timestamp}
                </div>
              </div>
              <div className={styles.messageActions}>
                <button className={styles.messageAction}>Copy</button>
                <button className={styles.messageAction}>Like</button>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className={styles.typingIndicator}>
            <span>AI is thinking</span>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <button
        className={`${styles.scrollToBottom} ${showScrollButton ? styles.visible : ''}`}
        onClick={() => scrollToBottom()}
        aria-label="Scroll to bottom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 11 12 16 7 11" />
          <line x1="12" y1="4" x2="12" y2="16" />
        </svg>
      </button>

      <form onSubmit={handleSubmit} className={styles.chatInputForm}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Physical AI & Humanoid Robotics..."
          disabled={isLoading}
          className={styles.chatInput}
          rows="1"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className={styles.chatSendButton}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send
        </button>
      </form>
    </div>
  );
};

const EnhancedChatbotWrapper = () => {
  return (
    <BrowserOnly>
      {() => <EnhancedChatbot />}
    </BrowserOnly>
  );
};

export default EnhancedChatbotWrapper;