import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Toggle chat widget open/close
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the real backend API
      const response = await callBackendAPI(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        sources: response.sources || [] // Include sources if available
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your request. Please make sure the backend server is running on port 8000.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Call the real backend API
  const callBackendAPI = async (query) => {
    try {
      // Generate a conversation ID if needed
      const conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Make API call to backend
      const response = await fetch('http://localhost:8000/api/rag/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          conversation_id: conversationId,
          chapter_ids: [] // Can specify chapter IDs if needed
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Format response to match expected structure
      return {
        text: data.response,
        sources: data.sources.map(source => ({
          title: source,
          url: source // This might need to be adjusted based on actual source format
        }))
      };
    } catch (error) {
      console.error('Error calling backend API:', error);
      throw error;
    }
  };

  // Handle text selection for context-aware queries
  const handleTextSelection = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      setInputValue(selectedText);
      setIsOpen(true); // Open the chat if it's closed
    }
  };

  // Add event listener for text selection
  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 0); // Use setTimeout to allow selection to complete
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-widget">
      {isOpen ? (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-header-icon">🤖</div>
              <div className="chat-header-text">
                <h3>AI Humanoid Robotics Assistant</h3>
                <p className="chat-status">Online</p>
              </div>
            </div>
            <button className="chat-close" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="bot-icon-large">🤖</div>
                <h4>Hello! I'm your AI assistant</h4>
                <p>Ask me anything about Physical AI and Humanoid Robotics</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${message.sender}-message`}
                >
                  <div className="message-avatar">
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content-wrapper">
                    <div className="message-content">
                      {message.text}
                      {message.sources && message.sources.length > 0 && (
                        <div className="message-sources">
                          <small>📚 Sources:</small>
                          <ul>
                            {message.sources.map((source, idx) => (
                              <li key={idx}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">
                                  {source.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className={`message-timestamp ${message.sender}-timestamp`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="message-bubble bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content-wrapper">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="chat-input"
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()} className="send-button">
              ➤
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-toggle" onClick={toggleChat}>
          <span>🤖</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;