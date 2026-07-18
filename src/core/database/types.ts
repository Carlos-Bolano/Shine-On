export interface Category {
  id: string;
  name: string;
  icon: string;
  colorLight: string;
  colorDark: string;
  iconColor: string;
  gradients: string[];
}

export interface Phrase {
  id: string;
  text: string;
  author: string;
  categoryId: string;
  createdAt: string;
  isActive: boolean;
  likes: number;
}

export interface OnboardingSettings {
  hasCompletedOnboarding: boolean;
  selectedCategories: string[];
  frequency: number;
  startTime: string;
  endTime: string;
}
