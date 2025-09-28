import { Category, Moment } from "../../types";

export const DUMMY_MOMENTS: Moment[] = [
  {
    id: "1",
    content:
      "Had the most amazing family dinner tonight! Mom made her famous lasagna and we all laughed so hard at dad's jokes. These are the moments that make life beautiful.",
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    category: "family",
    collection: "family-time",
    tags: ["dinner", "lasagna", "laughter", "family"],
    createdAt: new Date("2024-01-15T19:30:00Z"),
    updatedAt: new Date("2024-01-15T19:30:00Z"),
    mood: "happy",
  },
  {
    id: "2",
    content:
      "Just finished my first marathon! The feeling of crossing that finish line after months of training is indescribable. Never thought I could do it!",
    mediaType: "photo",
    mediaUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "work",
    collection: "learning-growth",
    tags: ["marathon", "achievement", "fitness", "goal"],
    createdAt: new Date("2024-01-14T14:20:00Z"),
    updatedAt: new Date("2024-01-14T14:20:00Z"),
    mood: "excited",
  },
  {
    id: "3",
    content:
      "Coffee with Sarah turned into a 3-hour conversation about life, dreams, and everything in between. These deep talks with friends are pure gold.",
    mediaType: "text",
    category: "friends",
    collection: "daily-moments",
    tags: ["coffee", "conversation", "friendship", "deep-talk"],
    createdAt: new Date("2024-01-13T10:15:00Z"),
    updatedAt: new Date("2024-01-13T10:15:00Z"),
    mood: "peaceful",
  },
  {
    id: "4",
    content:
      "Watched the sunset from my balcony today. Sometimes the simplest moments are the most profound. Grateful for this peaceful evening.",
    mediaType: "photo",
    mediaUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    category: "random",
    collection: "daily-moments",
    tags: ["sunset", "peaceful", "gratitude", "nature"],
    createdAt: new Date("2024-01-12T18:45:00Z"),
    updatedAt: new Date("2024-01-12T18:45:00Z"),
    mood: "grateful",
  },
  {
    id: "5",
    content:
      "My little sister called me crying because she got her first job offer! Hearing her excitement and pride made my whole week. So proud of her!",
    mediaType: "audio",
    mediaUrl: "https://example.com/audio/sister-call.mp3",
    category: "family",
    collection: "family-time",
    tags: ["sister", "job", "proud", "celebration"],
    createdAt: new Date("2024-01-11T16:30:00Z"),
    updatedAt: new Date("2024-01-11T16:30:00Z"),
    mood: "excited",
  },
  {
    id: "6",
    content:
      "Team lunch turned into an impromptu karaoke session in the office. My colleagues are absolutely hilarious! Work doesn't always have to be serious.",
    mediaType: "video",
    mediaUrl: "https://example.com/video/office-karaoke.mp4",
    category: "work",
    collection: "random-joy",
    tags: ["team", "karaoke", "fun", "colleagues"],
    createdAt: new Date("2024-01-10T13:00:00Z"),
    updatedAt: new Date("2024-01-10T13:00:00Z"),
    mood: "happy",
  },
  {
    id: "7",
    content:
      "Random act of kindness: helped an elderly lady carry her groceries to her car. Her smile and 'God bless you' made my day. Small gestures, big impact.",
    mediaType: "text",
    category: "random",
    collection: "daily-moments",
    tags: ["kindness", "elderly", "helping", "gratitude"],
    createdAt: new Date("2024-01-09T15:20:00Z"),
    updatedAt: new Date("2024-01-09T15:20:00Z"),
    mood: "grateful",
  },
  {
    id: "8",
    content:
      "Game night with the squad! We played board games until 2 AM and I haven't laughed that hard in months. Friendship is the best medicine.",
    mediaType: "photo",
    mediaUrl:
      "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400",
    category: "friends",
    collection: "random-joy",
    tags: ["game-night", "board-games", "friends", "late-night"],
    createdAt: new Date("2024-01-08T23:30:00Z"),
    updatedAt: new Date("2024-01-08T23:30:00Z"),
    mood: "happy",
  },
  {
    id: "9",
    content:
      "Finished reading 'The Alchemist' today. That book changed my perspective on so many things. Sometimes the right book finds you at the right time.",
    mediaType: "text",
    category: "random",
    collection: "learning-growth",
    tags: ["reading", "books", "inspiration", "growth"],
    createdAt: new Date("2024-01-07T20:00:00Z"),
    updatedAt: new Date("2024-01-07T20:00:00Z"),
    mood: "peaceful",
  },
  {
    id: "10",
    content:
      "Mom surprised me with homemade cookies today. She said she was thinking about me and wanted to make me smile. Moms are the best!",
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
    category: "family",
    collection: "family-time",
    tags: ["mom", "cookies", "surprise", "love"],
    createdAt: new Date("2024-01-06T14:15:00Z"),
    updatedAt: new Date("2024-01-06T14:15:00Z"),
    mood: "grateful",
  },
  {
    id: "11",
    content:
      "Successfully debugged a complex issue at work today. The feeling of finally solving something that's been bugging you for days is incredible!",
    mediaType: "text",
    category: "work",
    collection: "learning-growth",
    tags: ["debugging", "problem-solving", "achievement", "coding"],
    createdAt: new Date("2024-01-05T17:45:00Z"),
    updatedAt: new Date("2024-01-05T17:45:00Z"),
    mood: "excited",
  },
  {
    id: "12",
    content:
      "Spontaneous road trip with friends! We drove to the beach, watched the waves, and talked about life. Sometimes the best plans are no plans.",
    mediaType: "video",
    mediaUrl: "https://example.com/video/road-trip.mp4",
    category: "friends",
    collection: "random-joy",
    tags: ["road-trip", "beach", "spontaneous", "adventure"],
    createdAt: new Date("2024-01-04T12:00:00Z"),
    updatedAt: new Date("2024-01-04T12:00:00Z"),
    mood: "happy",
  },
];

export const DUMMY_CATEGORIES: Category[] = [
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
  {
    id: "travel",
    name: "Travel",
    color: "#FECA57",
    icon: "airplane",
  },
  {
    id: "food",
    name: "Food",
    color: "#FF9FF3",
    icon: "restaurant",
  },
  {
    id: "fitness",
    name: "Fitness",
    color: "#54A0FF",
    icon: "fitness",
  },
  {
    id: "learning",
    name: "Learning",
    color: "#5F27CD",
    icon: "school",
  },
];
