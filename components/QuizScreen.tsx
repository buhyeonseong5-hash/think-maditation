
import React, { useState } from 'react';

interface QuizScreenProps {
  correctLetters: string[];
  onResult: (isCorrect: boolean) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ correctLetters, onResult }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAnswer = answer.toUpperCase().replace(/\s/g, '');
    const formattedCorrect = correctLetters.join('');
    
    const isCorrect = formattedAnswer.split('').sort().join('') === formattedCorrect.split('').sort().join('');
    onResult(isCorrect);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">기억력 테스트</h2>
      <p className="text-gray-600 mb-6">명상 중에 보았던 5개의 알파벳을 입력하세요.</p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={10} // Allow some spaces
          className="w-full p-4 text-2xl text-center tracking-[0.5em] uppercase bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="A B C D E"
        />
        <button type="submit" className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg shadow-lg">
          정답 확인
        </button>
      </form>
    </div>
  );
};

export default QuizScreen;
