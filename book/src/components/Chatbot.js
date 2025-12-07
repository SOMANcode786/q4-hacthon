import React, { useState, useEffect, useRef } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import BrowserOnly from '@docusaurus/BrowserOnly';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
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
          conversation_id: 'default_conversation', // In a real app, you'd manage conversation IDs
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
        sources: data.sources || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="chatbot-header-title">AI Assistant</h3>
      </div>
      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="chatbot-welcome">
            <p>Hello! I'm your AI assistant for Physical AI & Humanoid Robotics.</p>
            <p>Ask me anything about the course content, and I'll do my best to help!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chatbot-message ${message.sender}-message`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="message-sources">
                    <small>Sources: {message.sources.slice(0, 2).join(', ')}</small>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="typing-indicator">
            <span>AI is thinking</span>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about Physical AI & Humanoid Robotics..."
          disabled={isLoading}
          className="chatbot-input"
        />
        <button type="submit" disabled={isLoading} className="chatbot-send-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send
        </button>
      </form>
    </div>
  );
};

const ChatbotWrapper = () => {
  return (
    <BrowserOnly>
      {() => <Chatbot />}
    </BrowserOnly>
  );
};

export default ChatbotWrapper;