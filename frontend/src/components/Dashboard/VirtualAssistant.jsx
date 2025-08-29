// ...keep your imports unchanged
import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

const VirtualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! I'm your DALScooter virtual assistant. How can I help you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    'How do I register?',
    'What vehicle types are available?',
    'How do I book a ride?',
  ];

  // Simulated bot response logic (like the first code)
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes("register")) {
      return "To register, click on the 'Start your Journey' button on the landing page. You'll need to provide your name, email, create a password, and answer a security question.";
    } else if (input.includes("vehicle") || input.includes("bike") || input.includes("scooter")) {
      return "We offer three types of vehicles: eBikes, Gyroscooters, and Segways. All are eco-friendly and perfect for campus travel!";
    } else if (input.includes("book") || input.includes("ride")) {
      return "To book a ride, login to your account and then click on book now on available bikes. Enter the date, and time.";
    } else if (input.includes("code") || input.includes("access")) {
      return "Booking reference is visible in Booking history once your booking is confirmed.";
    } else if (input.includes("feedback") || input.includes("suggestion")) {
      return "We value your feedback! Please use the 'Feedback' at top of the dashboard.";
    } else {
      return "I'm here to help with DALScooter services! You can ask me about registration, booking, vehicle types, feedback, or finding your access codes.";
    }
  };

  const sendUserMessage = (message) => {
    setMessages(prev => [...prev, { type: 'user', text: message }]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botText = getBotResponse(message);
      setMessages(prev => [...prev, { type: 'bot', text: botText }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    sendUserMessage(inputText.trim());
  };

  const handleQuickAction = (text) => {
    sendUserMessage(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { type: 'bot', text: "Hi! I'm your DALScooter virtual assistant. How can I help you today?" }
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="position-fixed shadow-lg d-flex align-items-center justify-content-center"
        style={{
          width: '64px',
          height: '64px',
          zIndex: 1050,
          bottom: '24px',
          right: '24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)',
          border: 'none',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        aria-label="Open chat assistant"
      >
        <MessageCircle size={28} style={{ color: 'white' }} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="position-fixed shadow-lg"
          style={{
            width: '380px',
            height: '600px',
            zIndex: 1050,
            bottom: '100px',
            right: '24px',
            borderRadius: '1rem',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white'
          }}>

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-3"
            style={{
              background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)',
              color: 'white',
              flexShrink: 0
            }}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle p-2 me-2"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Bot size={20} />
              </div>
              <div>
                <h6 className="mb-0 fw-bold">DALScooter Assistant</h6>
                <small style={{ opacity: 0.9 }}>How can I help?</small>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-sm me-2" onClick={clearChat}
                style={{ color: 'white', opacity: 0.8 }}>Clear</button>
              <button className="btn-close btn-close-white shadow-none" onClick={() => setIsOpen(false)} />
            </div>
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 border-bottom bg-light">
              <p className="small mb-2 text-muted">Try asking:</p>
              <div className="d-flex flex-wrap gap-2">
                {quickActions.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(text)}
                    className="btn btn-sm btn-outline-primary rounded-pill"
                    style={{ fontSize: '12px' }}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-grow-1 p-3 bg-light overflow-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`d-flex mb-3 ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                {msg.type === 'bot' && (
                  <div className="rounded-circle p-2 me-2 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '32px', height: '32px', backgroundColor: '#1976d2' }}>
                    <Bot size={16} style={{ color: 'white' }} />
                  </div>
                )}
                <div
                  className="p-3 rounded-3"
                  style={{
                    maxWidth: '75%',
                    borderRadius: msg.type === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    backgroundColor: msg.type === 'user' ? '#1976d2' : 'white',
                    color: msg.type === 'user' ? 'white' : '#333',
                    border: msg.type === 'bot' ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <p className="mb-0 small" style={{ lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </p>
                </div>
                {msg.type === 'user' && (
                  <div className="rounded-circle p-2 ms-2 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '32px', height: '32px', backgroundColor: '#6c757d' }}>
                    <User size={16} style={{ color: 'white' }} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="d-flex justify-content-start mb-3">
                <div className="rounded-circle p-2 me-2 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '32px', height: '32px', backgroundColor: '#1976d2' }}>
                  <Bot size={16} style={{ color: 'white' }} />
                </div>
                <div className="p-3 rounded-3 bg-white border" style={{ maxWidth: '75%' }}>
                  <div className="d-flex align-items-center">
                    <div className="spinner-grow spinner-grow-sm me-1" style={{ width: '8px', height: '8px', color: '#1976d2' }} />
                    <div className="spinner-grow spinner-grow-sm me-1" style={{ width: '8px', height: '8px', color: '#1976d2', animationDelay: '0.1s' }} />
                    <div className="spinner-grow spinner-grow-sm" style={{ width: '8px', height: '8px', color: '#1976d2', animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-top bg-light">
            <div className="input-group">
              <input
                type="text"
                className="form-control chat-input"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <button
                className="btn text-white"
                style={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)'
                }}
                onClick={handleSendMessage}
                disabled={isTyping || !inputText.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualAssistant;
