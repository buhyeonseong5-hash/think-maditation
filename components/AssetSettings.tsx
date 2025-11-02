import React, { useRef } from 'react';
import type { AppAssets } from '../types';
import { DEFAULT_ASSETS } from '../assets';

interface AssetSettingsProps {
  assets: AppAssets;
  onAssetsChange: (newAssets: AppAssets) => void;
  onBack: () => void;
}

const FileInput: React.FC<{ label: string; accept: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, accept, onChange }) => (
    <div className="w-full mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <input type="file" accept={accept} onChange={onChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
    </div>
);

const isValidAssetsObject = (obj: any): obj is AppAssets => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  const { lotusImage, soundEffect, voiceFiles } = obj;
  if (typeof lotusImage !== 'string' || !lotusImage.startsWith('data:image')) {
    return false;
  }
  if (typeof soundEffect !== 'string' || !soundEffect.startsWith('data:audio')) {
    return false;
  }
  if (!voiceFiles || typeof voiceFiles !== 'object' || Array.isArray(voiceFiles)) {
    return false;
  }
  if (Object.keys(voiceFiles).length !== 10) {
    return false;
  }
  for (let i = 0; i < 10; i++) {
    const voiceFile = voiceFiles[i];
    if (typeof voiceFile !== 'string' || !voiceFile.startsWith('data:audio')) {
      return false;
    }
  }
  return true;
};

const AssetSettings: React.FC<AssetSettingsProps> = ({ assets, onAssetsChange, onBack }) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (assetKey: 'lotusImage' | 'soundEffect') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAssetsChange({ ...assets, [assetKey]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVoiceFileChange = (digit: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newVoiceFiles = {
          ...assets.voiceFiles,
          [digit]: reader.result as string
        };
        onAssetsChange({ ...assets, voiceFiles: newVoiceFiles });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    try {
      const jsonString = JSON.stringify(assets, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'think-meditation-settings.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export settings:", error);
      alert("설정 내보내기에 실패했습니다.");
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File is not readable");
        const importedAssets = JSON.parse(text);
        if (isValidAssetsObject(importedAssets)) {
          onAssetsChange(importedAssets);
          alert("설정을 성공적으로 가져왔습니다.");
        } else {
          throw new Error("Invalid settings file format.");
        }
      } catch (error) {
        console.error("Failed to import settings:", error);
        alert("잘못된 설정 파일이거나 파일을 읽는 데 실패했습니다.");
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("정말로 모든 설정을 초기값으로 되돌리시겠습니까?")) {
      onAssetsChange(DEFAULT_ASSETS);
      alert("설정이 초기화되었습니다.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">자산 설정</h2>
      
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">기본 파일</h3>
          <FileInput label="연꽃 이미지 (Dot Meditation)" accept="image/*" onChange={handleFileChange('lotusImage')} />
          <img src={assets.lotusImage} alt="연꽃 미리보기" className="w-20 h-20 mx-auto mb-4 rounded-full object-cover"/>

          <FileInput label="효과음 (Breathing Meditation)" accept="audio/*" onChange={handleFileChange('soundEffect')} />
          <audio controls src={assets.soundEffect} className="w-full mb-4 h-10"></audio>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">숫자 음성 파일 (0-9)</h3>
            <p className="text-sm text-gray-600 mb-4">기본 음성을 대체할 사용자 음성 파일을 업로드하세요.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(10).keys()].map(digit => (
                <div key={digit}>
                    <label className="block text-gray-700 text-sm font-bold mb-1">숫자 {digit}</label>
                    <input type="file" accept="audio/*" onChange={handleVoiceFileChange(digit)} className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                    <audio controls src={assets.voiceFiles[digit]} className="w-full mt-2 h-8"></audio>
                </div>
            ))}
            </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">설정 관리</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={handleExport} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md">
              내보내기
            </button>
            <button onClick={handleImportClick} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md">
              가져오기
            </button>
            <button onClick={handleReset} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md">
              초기화
            </button>
          </div>
          <input
            type="file"
            ref={importInputRef}
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
        <button onClick={onBack} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg shadow-lg">
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default AssetSettings;