import React, { useEffect } from 'react';

interface CreditsPageProps {
  onContinue: () => void;
}

export default function CreditsPage({ onContinue }: CreditsPageProps) {
  useEffect(() => {
    // Аналитика для страницы кредитов
    if ((window as any).gtag) (window as any).gtag('event', '0000_credits_page_view');
    if ((window as any).ym) (window as any).ym(96171108, 'reachGoal', '0000_credits_page_view');
  }, []);

  const handleContinueClick = () => {
    // Аналитика клика
    if ((window as any).gtag) (window as any).gtag('event', '0000_credits_click');
    if ((window as any).ym) (window as any).ym(96171108, 'reachGoal', '0000_credits_click');
    onContinue();
  };

  return (
    <div className="credits-container">
      <div className="credits-content">
        {/* Header */}
        <div className="credits-header">
          <div className="back-button">←</div>
          <div className="header-title">Предложение от банка</div>
        </div>

        {/* Main Graphic */}
        <div className="credits-graphic">
          <div className="shock-emoji">😱</div>
        </div>

        {/* Main Message */}
        <h1 className="credits-title">
          Вы исчерпали бесплатные ходы!
        </h1>

        {/* Information Text */}
        <div className="credits-description">
          <p>Календарь выгоды ждёт продолжения.</p>
          <p>Докупите кредиты и откройте новые предложения.</p>
          <p><strong>1 кредит = 1 запрос</strong></p>
          <p><strong>5 кредитов = всего 49 Р</strong></p>
          <p>Не останавливайтесь на полпути — впереди ещё больше скидок!</p>
        </div>

        {/* Call to Action Button */}
        <button className="credits-cta-button" onClick={handleContinueClick}>
          Продолжить за 49 Р
        </button>
      </div>
    </div>
  );
}
