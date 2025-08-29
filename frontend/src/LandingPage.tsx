import React, { useEffect } from 'react';

// Import images from public folder
const calendarImg = `${process.env.PUBLIC_URL}/img/calendar.png`;
const calendar2Img = `${process.env.PUBLIC_URL}/img/calendar2.png`;
const clockImg = `${process.env.PUBLIC_URL}/img/clock.svg`;
const percentImg = `${process.env.PUBLIC_URL}/img/percent.svg`;
const rubFlagImg = `${process.env.PUBLIC_URL}/img/rub-flag.svg`;

interface LandingPageProps {
  onStartChat: () => void;
}

export default function LandingPage({ onStartChat }: LandingPageProps) {
  useEffect(() => {
    // Аналитика для лендинга - только при первом рендере
    if ((window as any).gtag) (window as any).gtag('event', '6191_page_view_landing_var1');
    if ((window as any).ym) (window as any).ym(96171108, 'reachGoal', '6191_page_view_landing_var1');
  }, []);

  const handleStartClick = () => {
    // Аналитика клика на кнопку "Попробовать бесплатно"
    if ((window as any).gtag) (window as any).gtag('event', '6191_click_continue_var1');
    if ((window as any).ym) (window as any).ym(96171108, 'reachGoal', '6191_click_continue_var1');
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
