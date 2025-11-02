export enum AppScreen {
  HOME,
  BREATHING_SETTINGS,
  BREATHING_MEDITATION,
  DOT_SETTINGS,
  DOT_MEDITATION,
  QUIZ,
  RESULT,
  ASSET_SETTINGS,
}

export enum SoundOption {
  VOICE = "음성",
  EFFECT = "효과음",
  MUTE = "무음",
}

export interface BreathingSettings {
  duration: number; // in minutes
  interval: number; // in seconds
  sound: SoundOption;
}

export interface DotSettings {
  duration: number; // in minutes
}

export interface AppAssets {
  lotusImage: string;
  soundEffect: string;
  voiceFiles: { [key: number]: string };
}