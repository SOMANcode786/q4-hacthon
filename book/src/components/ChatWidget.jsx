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
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a response
      const response = await simulateAPIResponse(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        sources: response.sources || [] // Include sources if available
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API response (replace with actual API call)
  const simulateAPIResponse = async (query) => {
    // This is a placeholder - in real implementation, call your backend API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: `I received your query: "${query}". This is a simulated response from the RAG chatbot. In the real implementation, this would call the backend API to get a response based on the book content.`,
          sources: [
            { title: 'Introduction to Physical AI', url: '/docs/introduction' },
            { title: 'The Robotic Nervous System', url: '/docs/ros2' }
          ]
        });
      }, 1000);
    });
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
            <h3>AI Humanoid Robotics Assistant</h3>
            <button className="chat-close" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <p>Hello! I'm your AI assistant for Humanoid Robotics content.</p>
                <p>Ask me anything about the book or select text on the page for context-aware help.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.sender}-message`}
                >
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
              ))
            )}
            {isLoading && (
              <div className="chat-message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span>AI is thinking...</span>
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
              placeholder="Ask about Humanoid Robotics content..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              🚀 Send
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-toggle" onClick={toggleChat}>
          <span>🤖 AI Assistant</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;