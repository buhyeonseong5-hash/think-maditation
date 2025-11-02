import React, { useState, useEffect } from 'react';
import { AppScreen, SoundOption } from './types';
import type { BreathingSettings, DotSettings, AppAssets } from './types';
import HomeScreen from './components/HomeScreen';
import BreathingSettingsComponent from './components/BreathingSettings';
import BreathingMeditation from './components/BreathingMeditation';
import DotSettingsComponent from './components/DotSettings';
import DotMeditation from './components/DotMeditation';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import ParticleCanvas from './components/ParticleCanvas';
import AssetSettingsComponent from './components/AssetSettings';
import { DEFAULT_ASSETS } from './assets';

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

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.HOME);
  
  const [assets, setAssets] = useState<AppAssets>(() => {
    try {
      const savedAssets = localStorage.getItem('meditation-assets');
      if (savedAssets) {
        const parsed = JSON.parse(savedAssets);
        if (isValidAssetsObject(parsed)) {
          return parsed;
        }
        console.warn("Invalid assets in localStorage, falling back to default.");
      }
    } catch (error) {
      console.error("Could not load assets from localStorage", error);
    }
    return DEFAULT_ASSETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('meditation-assets', JSON.stringify(assets));
    } catch (error) {
      console.error("Could not save assets to localStorage", error);
    }
  }, [assets]);

  const [breathingSettings, setBreathingSettings] = useState<BreathingSettings>({
    duration: 5,
    interval: 10,
    sound: SoundOption.VOICE,
  });

  const [dotSettings, setDotSettings] = useState<DotSettings>({
    duration: 5,
  });

  const [quizLetters, setQuizLetters] = useState<string[]>([]);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);

  const handleMeditationComplete = (letters: string[]) => {
    setQuizLetters(letters);
    setScreen(AppScreen.QUIZ);
  };

  const handleQuizResult = (isCorrect: boolean) => {
    setIsQuizCorrect(isCorrect);
    setScreen(AppScreen.RESULT);
  };

  const handleBackToHome = () => {
    setScreen(AppScreen.HOME);
  };

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.HOME:
        return (
          <HomeScreen
            onSelectBreathing={() => setScreen(AppScreen.BREATHING_SETTINGS)}
            onSelectDot={() => setScreen(AppScreen.DOT_SETTINGS)}
            onGoToSettings={() => setScreen(AppScreen.ASSET_SETTINGS)}
          />
        );
      case AppScreen.BREATHING_SETTINGS:
        return (
          <BreathingSettingsComponent
            settings={breathingSettings}
            onSettingsChange={setBreathingSettings}
            onStart={() => setScreen(AppScreen.BREATHING_MEDITATION)}
          />
        );
       case AppScreen.BREATHING_MEDITATION:
        return (
          <BreathingMeditation
            settings={breathingSettings}
            assets={assets}
            onComplete={handleMeditationComplete}
            onExit={handleBackToHome}
          />
        );
      case AppScreen.DOT_SETTINGS:
         return (
          <DotSettingsComponent
            settings={dotSettings}
            onSettingsChange={setDotSettings}
            onStart={() => setScreen(AppScreen.DOT_MEDITATION)}
          />
        );
      case AppScreen.DOT_MEDITATION:
        return (
            <DotMeditation 
              settings={dotSettings}
              assets={assets}
              onComplete={handleMeditationComplete}
              onExit={handleBackToHome}
            />
        );
      case AppScreen.QUIZ:
        return <QuizScreen correctLetters={quizLetters} onResult={handleQuizResult} />;
      case AppScreen.RESULT:
        return <ResultScreen isCorrect={isQuizCorrect} onBackToHome={handleBackToHome} />;
      case AppScreen.ASSET_SETTINGS:
        return <AssetSettingsComponent assets={assets} onAssetsChange={setAssets} onBack={handleBackToHome} />;
      default:
        return <HomeScreen onSelectBreathing={() => {}} onSelectDot={() => {}} onGoToSettings={() => {}} />;
    }
  };
  
  const isMeditationScreen = screen === AppScreen.BREATHING_MEDITATION || screen === AppScreen.DOT_MEDITATION;
  const showParticles = !isMeditationScreen;

  return (
    <main className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${isMeditationScreen ? 'bg-gray-50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
        <ParticleCanvas isAnimating={showParticles} />
        <div className="z-10">{renderScreen()}</div>
    </main>
  );
};

export default App;