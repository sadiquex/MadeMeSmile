import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  className = "",
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      className={`bg-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        opacity,
      }}
    />
  );
}

interface SmileCardSkeletonProps {
  showMedia?: boolean;
}

export function SmileCardSkeleton({
  showMedia = true,
}: SmileCardSkeletonProps) {
  return (
    <View
      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {/* Media Section Skeleton */}
      {showMedia && (
        <View className="relative">
          <Skeleton width="100%" height={280} borderRadius={0} />

          {/* Category Badge Skeleton */}
          <View className="absolute top-4 left-4">
            <Skeleton width={80} height={28} borderRadius={14} />
          </View>

          {/* Media Type Indicator Skeleton */}
          <View className="absolute top-4 right-4">
            <Skeleton width={32} height={32} borderRadius={16} />
          </View>
        </View>
      )}

      {/* Content Section Skeleton */}
      <View className="p-6">
        {/* Message Lines Skeleton */}
        <View className="mb-4">
          <Skeleton
            width="100%"
            height={16}
            borderRadius={4}
            className="mb-2"
          />
          <Skeleton width="85%" height={16} borderRadius={4} className="mb-2" />
          <Skeleton width="60%" height={16} borderRadius={4} />
        </View>

        {/* Tags Skeleton */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <Skeleton width={60} height={24} borderRadius={12} />
          <Skeleton width={80} height={24} borderRadius={12} />
          <Skeleton width={70} height={24} borderRadius={12} />
        </View>

        {/* Bottom Section Skeleton */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Skeleton
              width={16}
              height={16}
              borderRadius={8}
              className="mr-2"
            />
            <Skeleton width={80} height={14} borderRadius={4} />
          </View>

          <View className="flex-row items-center">
            <Skeleton
              width={16}
              height={16}
              borderRadius={8}
              className="mr-1"
            />
            <Skeleton width={20} height={14} borderRadius={4} />
          </View>
        </View>
      </View>
    </View>
  );
}

interface MomentsListSkeletonProps {
  count?: number;
  showMedia?: boolean;
}

export function MomentsListSkeleton({
  count = 3,
  showMedia = true,
}: MomentsListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SmileCardSkeleton key={index} showMedia={showMedia} />
      ))}
    </>
  );
}
