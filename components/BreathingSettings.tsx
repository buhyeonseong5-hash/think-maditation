
import React from 'react';
import type { BreathingSettings } from '../types';
import { SoundOption } from '../types';
import Slider from './Slider';

interface BreathingSettingsProps {
  settings: BreathingSettings;
  onSettingsChange: (newSettings: BreathingSettings) => void;
  onStart: () => void;
}

const BreathingSettings: React.FC<BreathingSettingsProps> = ({ settings, onSettingsChange, onStart }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, [e.target.id]: Number(e.target.value) });
  };
  
  const handleSoundChange = (sound: SoundOption) => {
    onSettingsChange({ ...settings, sound });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">호흡 & 숫자 세기 설정</h2>
      
      <Slider 
        label="명상 시간"
        value={settings.duration}
        min={3}
        max={60}
        unit="분"
        onChange={(e) => onSettingsChange({ ...settings, duration: Number(e.target.value) })}
      />

      <Slider
        label="카운팅 시간"
        value={settings.interval}
        min={3}
        max={20}
        unit="초"
        onChange={(e) => onSettingsChange({ ...settings, interval: Number(e.target.value) })}
      />

      <div>
        <label className="block text-lg text-gray-700 mb-3">음원 선택</label>
        <div className="flex justify-around">
          {Object.values(SoundOption).map(option => (
            <button
              key={option}
              onClick={() => handleSoundChange(option)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                settings.sound === option ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-center text-sm text-indigo-700 bg-indigo-50 p-3 rounded-lg">"화면에 나오는 알파벳을 외워서 정답을 맞춰보세요."</p>

      <button onClick={onStart} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg shadow-lg">
        명상 시작
      </button>
    </div>
  );
};

export default BreathingSettings;
