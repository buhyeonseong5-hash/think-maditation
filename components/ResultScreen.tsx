
import React, { useEffect, useState } from 'react';
import Confetti from './Confetti';

interface ResultScreenProps {
  isCorrect: boolean;
  onBackToHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isCorrect, onBackToHome }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl text-center">
      {isCorrect && <Confetti />}
      <h2 className="text-4xl font-bold mb-4">
        {isCorrect ? '🎉 축하합니다! 🎉' : '아쉬워요!'}
      </h2>
      <p className="text-xl text-gray-700 mb-8">
        {isCorrect ? '완벽한 집중력이네요. 마음의 평온을 찾으셨군요.' : '괜찮아요. 다음번엔 더 잘할 수 있을 거예요.'}
      </p>

      {showButton && (
        <button onClick={onBackToHome} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg shadow-lg animate-fade-in">
          돌아가기
        </button>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ResultScreen;
