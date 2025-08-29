import React, { useEffect } from 'react';

// Import images from public folder
const calendarImg = '/img/calendar.png';
const calendar2Img = '/img/calendar2.png';
const clockImg = '/img/clock.svg';
const percentImg = '/img/percent.svg';
const rubFlagImg = '/img/rub-flag.svg';

interface LandingPageProps {
  onStartChat: () => void;
}

export default function LandingPage({ onStartChat }: LandingPageProps) {
  useEffect(() => {
    // Аналитика для лендинга
    if ((window as any).gtag) (window as any).gtag('event', '0000_landing_view');
    if ((window as any).ym) (window as any).ym(96171108, 'reachGoal', '0000_landing_view');
  }, []);

  const handleStartClick = () => {
    // Аналитика клика
    if ((window as any).gtag) (window as any).gtag('event', '0000_landing_click');
    if ((window as any).ym) (window as any).ym(96171108, 'reachGoal', '0000_landing_click');
    onStartChat();
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Top Graphic Section */}
        <div className="landing-graphic">
          <img src={calendarImg} alt="Calendar" className="main-calendar" />
        </div>

        {/* Main Heading */}
        <h1 className="landing-title">
          Календарь вашей выгоды на&nbsp;неделю
        </h1>

        {/* Introductory Text */}
        <p className="landing-description">
          Теперь вы можете заранее узнавать, где выгоднее делать покупки: сообщим вам как о&nbsp;сезонных распродажах, так и&nbsp;о&nbsp;закрытых акциях. Подписка действует одну неделю: вы получаете полный план выгодных покупок и&nbsp;напоминания об&nbsp;акциях. После окончания срока подписку можно обновить.
        </p>

        {/* Feature List */}
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">
              <img src={calendar2Img} alt="Calendar" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              Получайте напоминания о&nbsp;пресейлах и&nbsp;закрытых распродажах с&nbsp;супер-кэшбэком
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <img src={clockImg} alt="Clock" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              Узнавайте, какие категории дают максимум выгоды именно сейчас
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <img src={percentImg} alt="Percent" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              Следите за&nbsp;сезонными акциями с&nbsp;кэшбэком до&nbsp;100% — от&nbsp;одежды до&nbsp;путешествий
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <img src={rubFlagImg} alt="Ruble" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              Каждую неделю — новый актуальный выгодный календарь
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <button className="cta-button" onClick={handleStartClick}>
          Попробовать бесплатно
        </button>
      </div>
    </div>
  );
}
