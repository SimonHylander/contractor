import { create } from "zustand";

interface VoiceStore {
  intent?: string;
  transcription?: string;
  setIntent: (intent: string) => void;
  setTranscription: (transcription: string) => void;
  clear: () => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  intent: undefined,
  transcription: undefined,
  setIntent: (intent) => set({ intent }),
  setTranscription: (transcription) => set({ transcription }),
  clear: () => set({ intent: undefined, transcription: undefined }),
}));
