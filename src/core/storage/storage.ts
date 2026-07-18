import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingSettings } from "../database/types";

const STORAGE_KEYS = {
  ONBOARDING_SETTINGS: "onboarding_settings",
  LIKED_PHRASES: "liked_phrases",
};

export const Storage = {
  async getOnboardingSettings(): Promise<OnboardingSettings | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error getting onboarding settings:", e);
      return null;
    }
  },

  async saveOnboardingSettings(settings: Partial<OnboardingSettings>): Promise<void> {
    try {
      const current = await this.getOnboardingSettings();
      const newSettings = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_SETTINGS, JSON.stringify(newSettings));
    } catch (e) {
      console.error("Error saving onboarding settings:", e);
    }
  },

  async clearOnboardingSettings(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_SETTINGS);
  },

  async getLikedPhrases(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LIKED_PHRASES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error getting liked phrases:", e);
      return [];
    }
  },

  async toggleLikedPhrase(phraseId: string): Promise<void> {
    try {
      const liked = await this.getLikedPhrases();
      const newLiked = liked.includes(phraseId)
        ? liked.filter((id) => id !== phraseId)
        : [...liked, phraseId];
      await AsyncStorage.setItem(STORAGE_KEYS.LIKED_PHRASES, JSON.stringify(newLiked));
    } catch (e) {
      console.error("Error toggling liked phrase:", e);
    }
  },
};
