import { clsx, type ClassValue } from "clsx";
import { Clipboard } from "react-native";
import Toast from "react-native-toast-message";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryColor = (category: string) => {
  // use index to get the color
  switch (category) {
    case "family":
      return "bg-red-500";
    case "friends":
      return "bg-green-500";
    case "work":
      return "bg-blue-500";
    case "random":
      return "bg-yellow-500";
    case "travel":
      return "bg-orange-500";
    case "food":
      return "bg-pink-500";
    case "fitness":
      return "bg-purple-500";
    case "learning":
      return "bg-indigo-500";
    default:
      return "bg-gray-500";
  }
};

export const getCategoryGradientColors = (
  category: string
): [string, string, string] => {
  switch (category) {
    case "family":
      return ["transparent", "rgba(174, 48, 48, 0.4)", "rgb(174, 48, 48)"];
    case "friends":
      return ["transparent", "rgba(45, 156, 150, 0.4)", "rgb(45, 156, 150)"];
    case "work":
      return ["transparent", "rgba(59, 130, 246, 0.4)", "rgb(59, 130, 246)"];
    case "random":
      return ["transparent", "rgba(234, 179, 8, 0.4)", "rgb(234, 179, 8)"];
    case "travel":
      return ["transparent", "rgba(249, 115, 22, 0.4)", "rgb(249, 115, 22)"];
    case "food":
      return ["transparent", "rgba(236, 72, 153, 0.4)", "rgb(236, 72, 153)"];
    case "fitness":
      return ["transparent", "rgba(147, 51, 234, 0.4)", "rgb(147, 51, 234)"];
    case "learning":
      return ["transparent", "rgba(99, 102, 241, 0.4)", "rgb(99, 102, 241)"];
    default:
      return ["transparent", "rgba(107, 114, 128, 0.4)", "rgb(107, 114, 128)"];
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "family":
      return "heart";
    case "friends":
      return "people";
    case "work":
      return "briefcase";
    case "random":
      return "star";
    case "travel":
      return "airplane";
    case "food":
      return "restaurant";
    case "fitness":
      return "fitness";
    case "learning":
      return "school";
    default:
      return "star";
  }
};

export const formatDateAndTime = (date: Date) => {
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const copyToClipboard = (text: string) => {
  Clipboard.setString(text);
  Toast.show({
    type: "addressCopied",
    text1: "Copied to clipboard",
    position: "top",
  });
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
