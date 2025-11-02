
import React from 'react';
import type { DotSettings } from '../types';
import Slider from './Slider';

interface DotSettingsProps {
  settings: DotSettings;
  onSettingsChange: (newSettings: DotSettings) => void;
  onStart: () => void;
}

const DotSettings: React.FC<DotSettingsProps> = ({ settings, onSettingsChange, onStart }) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">점 명상 설정</h2>
      
      <Slider 
        label="명상 시간"
        value={settings.duration}
        min={3}
        max={60}
        unit="분"
        onChange={(e) => onSettingsChange({ ...settings, duration: Number(e.target.value) })}
      />
      
      <p className="text-center text-sm text-indigo-700 bg-indigo-50 p-3 rounded-lg">"화면에 나오는 알파벳을 외워서 정답을 맞춰보세요."</p>

      <button onClick={onStart} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg shadow-lg">
        명상 시작
      </button>
    </div>
  );
};

export default DotSettings;
