import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  gradientColors: [string, string, string];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: "Capture Your Moments",
    subtitle: "Every smile matters",
    description:
      "Preserve the beautiful moments that make you smile. From family gatherings to quiet moments of joy, capture them all.",
    backgroundImage:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=1200&fit=crop",
    gradientColors: [
      "rgba(239, 68, 68, 0.8)",
      "rgba(239, 68, 68, 0.4)",
      "transparent",
    ],
  },
  {
    id: 2,
    title: "Organize & Remember",
    subtitle: "Never forget the good times",
    description:
      "Categorize your moments by family, friends, work, or any theme that matters to you. Find your memories instantly.",
    backgroundImage:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1200&fit=crop",
    gradientColors: [
      "rgba(34, 197, 94, 0.8)",
      "rgba(34, 197, 94, 0.4)",
      "transparent",
    ],
  },
  {
    id: 3,
    title: "Share Your Joy",
    subtitle: "Spread happiness",
    description:
      "Share your favorite moments with loved ones or keep them private. Your memories, your way.",
    backgroundImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    gradientColors: [
      "rgba(59, 130, 246, 0.8)",
      "rgba(59, 130, 246, 0.4)",
      "transparent",
    ],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    } else {
      // Mark onboarding as completed and navigate to login
      //   await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as completed and navigate to login
    // await AsyncStorage.setItem("hasCompletedOnboarding", "true");
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map((slide) => (
          <View key={slide.id} style={{ width: screenWidth }}>
            <ImageBackground
              source={{ uri: slide.backgroundImage }}
              className="flex-1"
              resizeMode="cover"
            >
              <LinearGradient colors={slide.gradientColors} className="flex-1">
                <View className="flex-1 justify-center px-8">
                  <Text className="font-sora-bold text-blue-500 text-4xl mb-4 text-center">
                    {/* {slide.title} */}
                    asdfasdf
                  </Text>
                  <Text className="font-sora-medium text-white text-xl mb-6 text-center opacity-90">
                    {slide.subtitle}
                  </Text>
                  <Text className="font-sora text-white text-lg text-center leading-7 opacity-80">
                    {slide.description}
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View className="absolute bottom-0 left-0 right-0 p-8">
        {/* Indicators */}
        <View className="flex-row justify-center items-center mb-8">
          {onboardingData.map((_, index) => (
            <Animated.View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
              style={{
                width: index === currentIndex ? 32 : 8,
              }}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="font-sora-medium text-white text-lg opacity-80">
              Skip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            className="bg-white rounded-full px-8 py-4"
          >
            <Text className="font-sora-bold text-gray-900 text-lg">
              {currentIndex === onboardingData.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
