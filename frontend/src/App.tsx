import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = 'https://gh-loyalty-bot.onrender.com';

function App() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [landingShown, setLandingShown] = useState(false);
  const [creditsShown, setCreditsShown] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const savedCount = localStorage.getItem('questionCount');
    const savedLanding = localStorage.getItem('landingShown');
    const savedCredits = localStorage.getItem('creditsShown');
    const savedLimit = localStorage.getItem('limitReached');
    
    if (savedCount) setQuestionCount(parseInt(savedCount));
    if (savedLanding === 'true') setLandingShown(true);
    if (savedCredits === 'true') setCreditsShown(true);
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
      
      // Check limit - show credits page after 5 questions
      if (newCount >= 5 && !creditsShown) {
        setCreditsShown(true);
        localStorage.setItem('creditsShown', 'true');
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

  const continueWithPayment = () => {
    setCreditsShown(false);
    setLimitReached(true);
    localStorage.setItem('creditsShown', 'false');
    localStorage.setItem('limitReached', 'true');
  };

  const resetApp = () => {
    setMessages([]);
    setQuestionCount(0);
    setLandingShown(false);
    setCreditsShown(false);
    setLimitReached(false);
    localStorage.clear();
  };

  // Landing Page
  if (!landingShown) {
    return (
      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-graphic">
            <img src="/img/calendar.png" alt="Calendar" className="main-calendar" />
          </div>
          
          <h1 className="landing-title">
            Календарь вашей выгоды на неделю
          </h1>
          
          <p className="landing-description">
            Получите персональные рекомендации по выгодным покупкам и узнайте, когда лучше тратить деньги
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <img src="/img/clock.svg" alt="Clock" className="feature-icon-img" />
              </div>
              <span className="feature-text">Узнайте, когда выгоднее покупать</span>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <img src="/img/percent.svg" alt="Percent" className="feature-icon-img" />
              </div>
              <span className="feature-text">Получите максимальный кэшбэк</span>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <img src="/img/rub-flag.svg" alt="Rub Flag" className="feature-icon-img" />
              </div>
              <span className="feature-text">Экономьте на каждой покупке</span>
            </div>
          </div>
          
          <button onClick={startChat} className="cta-button">
            Попробовать бесплатно
          </button>
        </div>
      </div>
    );
  }

  // Credits Page (after 5 questions)
  if (creditsShown) {
    return (
      <div className="credits-container">
        <div className="credits-content">
          <div className="credits-header">
            <div className="header-title">Лимит исчерпан</div>
          </div>
          
          <div className="credits-graphic">
            <div className="shock-emoji">😱</div>
          </div>
          
          <h2 className="credits-title">Лимит бесплатных вопросов исчерпан</h2>
          
          <div className="credits-description">
            <p>Продолжите использование за <strong>49 ₽</strong></p>
          </div>
          
          <button onClick={continueWithPayment} className="credits-cta-button">
            Продолжить за 49 ₽
          </button>
        </div>
      </div>
    );
  }

  // Limit Page (final page)
  if (limitReached) {
    return (
      <div className="credits-container">
        <div className="credits-content">
          <div className="credits-header">
            <div className="header-title">Лимит исчерпан</div>
          </div>
          
          <div className="credits-graphic">
            <div className="shock-emoji">😱</div>
          </div>
          
          <h2 className="credits-title">Лимит бесплатных вопросов исчерпан</h2>
          
          <div className="credits-description">
            <p>Продукта не существует.</p>
          </div>
          
          <button onClick={resetApp} className="credits-cta-button">
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  // Chat Page
  return (
    <div className="main-chat-layout">
      <div className="chat-window">
        {messages.length === 0 ? (
          <div className="placeholder-message">
            Здравствуйте! Я помогу вам с вопросами по системе лояльности «Альфа-Выгодно» и «Витрина партнёров». Задайте ваш вопрос!
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.isUser ? 'user' : 'ai'}`}>
              {message.text}
            </div>
          ))
        )}
        {isLoading && (
          <div className="chat-bubble ai">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={!inputMessage.trim() || isLoading}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}

export default App;