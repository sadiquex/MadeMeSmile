import ScreenHeader from "@/components/ui/screen-header";
import VideoPlayer from "@/components/ui/video-player";
import {
  formatDateAndTime,
  getCategoryColor,
  getCategoryIcon,
} from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  deleteMoment,
  getMoments,
} from "../../../services/moments/moments.service";
import { Moment } from "../../../types";
import MomentActionsModal from "./moment-actions-modal";

export default function MomentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageHeight = 320; // Height of the image section
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMoment = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const moments = await getMoments();
      const foundMoment = moments.find((m) => m.id === id);

      if (foundMoment) {
        setMoment(foundMoment);
      } else {
        setError("Moment not found");
      }
    } catch (err) {
      console.error("Error fetching moment:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch moment");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMoment();
  }, [fetchMoment]);

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "grateful":
        return "🙏";
      case "excited":
        return "🎉";
      case "peaceful":
        return "😌";
      default:
        return "😊";
    }
  };

  const handleEdit = () => {
    console.log("Edit moment:", moment?.id);
    // TODO: Navigate to edit screen
  };

  const handleDelete = () => {
    if (!moment) return;

    Alert.alert(
      "Delete Moment",
      "Are you sure you want to delete this moment? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!moment) return;

    try {
      setIsDeleting(true);
      await deleteMoment(moment.id);

      // Show success message and navigate back
      // Alert.alert("Success", "Moment deleted successfully", [
      //   {
      //     text: "OK",
      //     onPress: () => router.back(),
      //   },
      // ]);
      Toast.show({
        type: "success",
        text1: "Moment deleted successfully",
      });
      router.back();
    } catch (error) {
      console.error("Error deleting moment:", error);
      Alert.alert("Error", "Failed to delete moment. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!moment?.mediaUrl) {
      Toast.show({
        type: "error",
        text1: "No media to save",
        text2: "This moment doesn't have any media to save",
      });
      return;
    }

    try {
      setIsSaving(true);

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to save media to your gallery",
          [{ text: "OK" }]
        );
        return;
      }

      // Save the media to gallery
      const asset = await MediaLibrary.createAssetAsync(moment.mediaUrl);

      // Create album if it doesn't exist
      const albumName = "MadeMeSmile";
      let album = await MediaLibrary.getAlbumAsync(albumName);
      if (!album) {
        album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Toast.show({
        type: "success",
        text1: "Saved to Gallery",
        text2: `Media saved to ${albumName} album`,
      });
    } catch (error) {
      console.error("Error saving to gallery:", error);
      Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: "Failed to save media to gallery. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    console.log("Share moment:", moment?.id);
    // TODO: Implement share functionality
  };

  const handleAddToCollection = () => {
    console.log("Add to collection:", moment?.id);
    // TODO: Implement add to collection
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="Loading..." showBackButton />
        <View className="flex-1 items-center justify-center">
          <Ionicons name="hourglass-outline" size={64} color="#9CA3AF" />
          <Text className="font-sora-bold text-gray-900 text-xl mt-4 mb-2">
            Loading moment...
          </Text>
          <Text className="font-sora text-gray-600 text-center px-8">
            Please wait while we fetch your moment
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error || !moment) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="Error" showBackButton />
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="font-sora-bold text-gray-900 text-xl mt-4 mb-2">
            {error || "Moment not found"}
          </Text>
          <Text className="font-sora text-gray-600 text-center px-8">
            This moment may have been deleted or doesn&apos;t exist
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title="Beautiful Memory"
        showRightButton
        showBackButton
        rightButtonOnPress={() => setShowActionsModal(true)}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Media Section with Parallax */}
        <View
          className="relative border-b border-gray-400"
          style={{ height: imageHeight, overflow: "hidden" }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, imageHeight],
                    outputRange: [0, -imageHeight * 0.5],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            {moment.mediaUrl && moment.mediaType === "photo" ? (
              <Image
                source={{ uri: moment.mediaUrl }}
                style={{ width: "100%", height: imageHeight * 1.5 }}
                resizeMode="cover"
              />
            ) : moment.mediaUrl && moment.mediaType === "video" ? (
              <VideoPlayer
                uri={moment.mediaUrl}
                width="100%"
                height={imageHeight * 1.5}
                showControls={true}
                autoPlay={false}
                loop={false}
                muted={false}
              />
            ) : (
              <View
                className="w-full bg-gray-100 items-center justify-center"
                style={{ height: imageHeight * 1.5 }}
              >
                <Ionicons
                  name={
                    moment.mediaType === "video"
                      ? "videocam"
                      : moment.mediaType === "audio"
                      ? "mic"
                      : "document-text"
                  }
                  size={64}
                  color="#9CA3AF"
                />
              </View>
            )}
          </Animated.View>

          {/* Gradient Overlay */}
          {/* <LinearGradient
            colors={getCategoryGradientColors(moment.category)}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
            }}
          /> */}

          {/* Category Badge */}
          <View className="absolute top-4 right-4">
            <View
              className={`${getCategoryColor(
                moment.category
              )} rounded-full px-3 py-1 flex-row items-center`}
            >
              <Ionicons
                name={getCategoryIcon(moment.category) as any}
                size={12}
                color="white"
              />
              <Text className="font-sora-medium text-white text-xs ml-1">
                {moment.category.charAt(0).toUpperCase() +
                  moment.category.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="p-4">
          {/* Full Content */}
          <Text className="font-sora text-gray-800 text-base leading-6 mb-6">
            {moment.content}
          </Text>

          {/* Tags */}
          {moment.tags.length > 0 && (
            <View className="mb-6">
              <Text className="font-sora-semibold text-gray-700 text-sm mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {moment.tags.map((tag: string, index: number) => (
                  <View
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1"
                  >
                    <Text className="font-sora text-gray-600 text-sm">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Mood */}
          {moment.mood && (
            <View className="mb-6">
              <Text className="font-sora-semibold text-gray-700 text-sm mb-3">
                Mood
              </Text>
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">
                  {getMoodEmoji(moment.mood)}
                </Text>
                <Text className="font-sora text-gray-600 text-base capitalize">
                  {moment.mood}
                </Text>
              </View>
            </View>
          )}

          {/* Date */}
          <View className="mb-6">
            <Text className="font-sora text-gray-600 text-sm">
              {formatDateAndTime(moment.createdAt)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Actions Modal */}
      <MomentActionsModal
        isVisible={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSaveToGallery={handleSaveToGallery}
        onShare={handleShare}
        onAddToCollection={handleAddToCollection}
        hasMedia={!!moment.mediaUrl}
        isSaving={isSaving}
      />
    </View>
  );
}
