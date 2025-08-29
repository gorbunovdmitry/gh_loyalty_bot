import React from 'react';
import './LandingPage.css';

// Import images from public folder
const calendarImg = '/img/calendar.png';
const clockImg = '/img/clock.svg';
const percentImg = '/img/percent.svg';
const rubFlagImg = '/img/rub-flag.svg';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Main Calendar Image */}
        <div className="main-calendar">
          <img src={calendarImg} alt="Calendar" />
        </div>

        {/* Title */}
        <h1 className="landing-title">
          Календарь вашей выгоды на неделю
        </h1>

        {/* Description */}
        <p className="landing-description">
          Получите персональные рекомендации по выгодным покупкам и узнайте, когда лучше тратить деньги
        </p>

        {/* Features List */}
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">
              <img src={clockImg} alt="Clock" />
            </div>
            <span>Узнайте, когда выгоднее покупать</span>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <img src={percentImg} alt="Percent" />
            </div>
            <span>Получите максимальный кэшбэк</span>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <img src={rubFlagImg} alt="Rub Flag" />
            </div>
            <span>Экономьте на каждой покупке</span>
          </div>
        </div>

        {/* Start Button */}
        <button onClick={onStart} className="start-button">
          Попробовать бесплатно
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
