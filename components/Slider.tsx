
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 1, unit, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor={label} className="flex justify-between text-lg text-gray-700 mb-2">
        <span>{label}</span>
        <span className="font-bold text-indigo-600">{value} {unit}</span>
      </label>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
};

export default Slider;
