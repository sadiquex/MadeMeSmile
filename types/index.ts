export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  reminderTime: string;
  reminderEnabled: boolean;
  defaultCategory: string;
  theme: "light" | "dark" | "auto";
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "family",
    name: "Family",
    color: "#FF6B6B",
    icon: "heart",
  },
  {
    id: "friends",
    name: "Friends",
    color: "#4ECDC4",
    icon: "people",
  },
  {
    id: "work",
    name: "Work",
    color: "#45B7D1",
    icon: "briefcase",
  },
  {
    id: "random",
    name: "Random",
    color: "#96CEB4",
    icon: "star",
  },
];

export const MOOD_OPTIONS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "grateful", label: "Grateful", emoji: "🙏" },
  { id: "excited", label: "Excited", emoji: "🎉" },
  { id: "peaceful", label: "Peaceful", emoji: "😌" },
] as const;

export const COLLECTION_OPTIONS = [
  { value: "daily-moments", label: "Daily Moments", icon: "📅" },
  { value: "family-time", label: "Family Time", icon: "👨‍👩‍👧‍👦" },
  { value: "learning-growth", label: "Learning & Growth", icon: "📚" },
  { value: "random-joy", label: "Random Joy", icon: "✨" },
] as const;
