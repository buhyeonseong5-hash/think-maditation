import React from 'react';

interface HomeScreenProps {
  onSelectBreathing: () => void;
  onSelectDot: () => void;
  onGoToSettings: () => void;
}

const MeditationCard: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-white/30"
  >
    <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectBreathing, onSelectDot, onGoToSettings }) => {
  return (
    <div className="text-center relative">
       <div className="absolute top-0 right-0">
        <button 
          onClick={onGoToSettings} 
          className="p-3 bg-white/70 backdrop-blur-md rounded-full text-gray-600 hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          aria-label="자산 설정"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Think - Meditation</h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        고요하고 편안한 자기 자신을 발견하고 유지하도록 돕는 두 가지 명상법을 통해 마음의 평화를 찾으세요.
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <MeditationCard
          title="호흡 & 숫자 세기 명상"
          description="숫자를 세는 행위와 호흡에 집중하여 마음의 잡념을 줄이고 정신적인 집중력을 향상시킵니다."
          onClick={onSelectBreathing}
        />
        <MeditationCard
          title="점 명상"
          description="한 점에 시각적 초점을 맞춤으로써 마음의 동요를 가라앉히고 안정된 의식 상태를 경험하도록 돕습니다."
          onClick={onSelectDot}
        />
      </div>
    </div>
  );
};

export default HomeScreen;