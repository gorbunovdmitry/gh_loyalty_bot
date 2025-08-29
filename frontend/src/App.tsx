import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = 'https://gh-loyalty-bot.onrender.com';

function App() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [landingShown, setLandingShown] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const savedCount = localStorage.getItem('questionCount');
    const savedLanding = localStorage.getItem('landingShown');
    const savedLimit = localStorage.getItem('limitReached');
    
    if (savedCount) setQuestionCount(parseInt(savedCount));
    if (savedLanding === 'true') setLandingShown(true);
    if (savedLimit === 'true') setLimitReached(true);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { text: userMessage, isUser: true }];
    setMessages(newMessages);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          promptcount: questionCount + 1
        }),
      });

      const data = await response.json();
      
      // Add AI response
      setMessages([...newMessages, { text: data.reply, isUser: false }]);
      
      // Update question count
      const newCount = questionCount + 1;
      setQuestionCount(newCount);
      localStorage.setItem('questionCount', newCount.toString());
      
      // Check limit
      if (newCount >= 5) {
        setLimitReached(true);
        localStorage.setItem('limitReached', 'true');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { text: 'Ошибка соединения с сервером', isUser: false }]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startChat = () => {
    setLandingShown(true);
    localStorage.setItem('landingShown', 'true');
  };

  const resetApp = () => {
    setMessages([]);
    setQuestionCount(0);
    setLandingShown(false);
    setLimitReached(false);
    localStorage.clear();
  };

  // Landing Page
  if (!landingShown) {
    return (
      <div className="landing-page">
        <div className="landing-content">
          <h1>Календарь вашей выгоды на неделю</h1>
          <p>Получите персональные рекомендации по выгодным покупкам и узнайте, когда лучше тратить деньги</p>
          <button onClick={startChat} className="start-button">
            Попробовать бесплатно
          </button>
        </div>
      </div>
    );
  }

  // Limit Page
  if (limitReached) {
    return (
      <div className="limit-page">
        <div className="limit-content">
          <h2>Лимит бесплатных вопросов исчерпан</h2>
          <p>Продукта не существует.</p>
          <button onClick={resetApp} className="reset-button">
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  // Chat Page
  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? 'user' : 'ai'}`}>
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="message ai loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        
        <div className="input-container">
          <div className="question-counter">
            Вопросов: {questionCount}/5
          </div>
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Задайте вопрос о системе лояльности Альфа-Выгодно..."
              disabled={isLoading}
              rows={3}
            />
            <button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;