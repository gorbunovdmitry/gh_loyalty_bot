import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import CreditsPage from './CreditsPage';
import LimitPage from './LimitPage';

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
    return <LandingPage onStart={startChat} />;
  }

  // Credits Page (after 5 questions)
  if (creditsShown) {
    return <CreditsPage onContinue={continueWithPayment} />;
  }

  // Limit Page (final page)
  if (limitReached) {
    return <LimitPage onReset={resetApp} />;
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