import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import LimitPage from './LimitPage';
import LandingPage from './LandingPage';
import CreditsPage from './CreditsPage';

const BACKEND_URL = 'https://gh-loyalty-bot.onrender.com';

function formatAIText(text: string) {
  // Заменяем **жирный** и *курсив* и \n на переносы строк, а также списки
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/\n/g, '<br/>')
    .replace(/^- (.*)$/gm, '<li>$1</li>');
  // Если есть <li>, обернуть в <ul>
  if (/<li>/.test(formatted)) {
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  }
  return formatted;
}

function App() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(1);
  const [showLanding, setShowLanding] = useState(
    localStorage.getItem('landingShown') !== '1'
  );
  const [showCredits, setShowCredits] = useState(false);

  const LIMIT = 5;
  const [questionCount, setQuestionCount] = useState(
    Number(localStorage.getItem('questionCount') || 0)
  );
  const [limitReached, setLimitReached] = useState(
    localStorage.getItem('limitReached') === '1'
  );

  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      setDots(1);
      return;
    }
    const interval = setInterval(() => {
      setDots(prev => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // JS-fix для мобильных: динамическая высота контейнера
  useEffect(() => {
    const setContainerHeight = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.style.height = window.innerHeight + 'px';
      }
    };
    setContainerHeight();
    window.addEventListener('resize', setContainerHeight);
    // Фокус на input/textarea
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(inp => {
      inp.addEventListener('focus', setContainerHeight);
      inp.addEventListener('blur', setContainerHeight);
    });
    return () => {
      window.removeEventListener('resize', setContainerHeight);
      inputs.forEach(inp => {
        inp.removeEventListener('focus', setContainerHeight);
        inp.removeEventListener('blur', setContainerHeight);
      });
    };
  }, []);

  // Аналитика: отправка событий
  const sendAnalyticsEvent = (event: string) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', event);
    }
    if ((window as any).ym) {
      (window as any).ym(96171108, 'reachGoal', event);
    }
  };

  useEffect(() => {
    // Событие первого рендера
    sendAnalyticsEvent('0000_page_view');
  // eslint-disable-next-line
  }, []);

  const handleStartChat = () => {
    setShowLanding(false);
    localStorage.setItem('landingShown', '1');
  };

  const handleCreditsContinue = () => {
    setShowCredits(false);
    setLimitReached(true);
    localStorage.setItem('limitReached', '1');
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || limitReached) return;
    const userMsg = { text: input, isUser: true };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    localStorage.setItem('questionCount', newCount.toString());
    if (newCount >= LIMIT) {
      setShowCredits(true);
    }

    try {
      const res = await fetch(BACKEND_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, promptcount: newCount }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { text: data.reply || 'Ошибка ответа AI', isUser: false },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { text: 'Ошибка соединения с сервером', isUser: false },
      ]);
    }
    setLoading(false);
    sendAnalyticsEvent('0000_click_send');
  };

  if (showLanding) {
    return <LandingPage onStartChat={handleStartChat} />;
  }

  if (showCredits) {
    return <CreditsPage onContinue={handleCreditsContinue} />;
  }

  if (limitReached) {
    sendAnalyticsEvent('0000_end_page_view');
    return <LimitPage />;
  }

  return (
    <div className="chat-container" ref={chatContainerRef}>
      <div className={"chat-window" + (messages.length === 0 && !loading ? " empty" : "")} ref={chatWindowRef}>
        {messages.length === 0 && !loading && (
          <div className="placeholder-message">
            Я - ИИ-ассистент Альфа-Банка по системе лояльности.
            {"\n"}
            Помогаю с вопросами по кэшбэку, баллам и партнёрским предложениям.
            {"\n"}
            Пожалуйста, не указывайте ФИО, номер счета и другие личные данные.
          </div>
        )}
        {messages.map((msg, i) => (
          !msg.isUser ? (
            <div
              key={i}
              className={`chat-bubble ${msg.isUser ? 'user' : 'ai'}`}
              dangerouslySetInnerHTML={{ __html: formatAIText(msg.text) }}
            />
          ) : (
            <div
              key={i}
              className={`chat-bubble ${msg.isUser ? 'user' : 'ai'}`}
            >
              {msg.text}
            </div>
          )
        ))}
        {loading && <div className="chat-bubble ai">AI печатает{".".repeat(dots)}</div>}
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button type="submit" disabled={loading}>Отправить</button>
      </form>
    </div>
  );
}

export default App; 