import React, { useState, useRef, useEffect } from 'react';
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, Spin } from 'antd';
import './Chatbot.css';

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Soy el asistente de Plan Risk 3D. ¿En qué te puedo ayudar hoy?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/suggestion_risk/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMsg.text }),
      });

      const data = await response.json();

      if (response.ok && data.respuesta) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.respuesta }]);
      } else {
        const errorMsg = data.error || 'Lo siento, ha ocurrido un error al intentar responder.';
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: `Error del servidor: ${errorMsg}` },
        ]);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Problema de conexión. Por favor, intenta de nuevo más tarde.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Botón flotante */}
      <div className={`chatbot-trigger ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? <CloseOutlined className="chatbot-icon" /> : <MessageOutlined className="chatbot-icon" />}
      </div>

      {/* Ventana de chat */}
      <div className={`chatbot-window ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <RobotOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
          <h3>Asistente IA</h3>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="message-avatar bot-avatar">
                  <RobotOutlined />
                </div>
              )}
              <div className={`message-bubble ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="message-avatar user-avatar">
                  <UserOutlined />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="message-wrapper bot">
              <div className="message-avatar bot-avatar">
                <RobotOutlined />
              </div>
              <div className="message-bubble bot loading">
                <Spin size="small" />
                <span style={{ marginLeft: 8 }}>Escribiendo...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <Input
            placeholder="Escribe tu pregunta..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            bordered={false}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            style={{ backgroundColor: '#2563eb' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
