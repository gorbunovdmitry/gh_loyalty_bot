import React from 'react';
import './CreditsPage.css';

interface CreditsPageProps {
  onContinue: () => void;
}

const CreditsPage: React.FC<CreditsPageProps> = ({ onContinue }) => {
  return (
    <div className="credits-page">
      <div className="credits-container">
        <div className="credits-content">
          <h2>Лимит бесплатных вопросов исчерпан</h2>
          <p>Продолжите использование за 49 ₽</p>
          <button onClick={onContinue} className="continue-button">
            Продолжить за 49 ₽
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
