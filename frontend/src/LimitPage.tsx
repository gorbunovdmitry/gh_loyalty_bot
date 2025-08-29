import React from 'react';
import './LimitPage.css';

interface LimitPageProps {
  onReset: () => void;
}

const LimitPage: React.FC<LimitPageProps> = ({ onReset }) => {
  return (
    <div className="limit-page">
      <div className="limit-container">
        <div className="limit-content">
          <h2>Лимит бесплатных вопросов исчерпан</h2>
          <p>Продукта не существует.</p>
          <button onClick={onReset} className="reset-button">
            Начать заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitPage;
