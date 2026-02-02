import ScreenHeader from "@/components/ui/screen-header";
import VideoPlayer from "@/components/ui/video-player";
import {
  formatDateAndTime,
  getCategoryColor,
  getCategoryIcon,
} from "@/lib/utils";
import {
  deleteMoment,
  getMomentById,
} from "@/services/moments/moments.service";
import { IMoment } from "@/services/moments/moments.types";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import MomentActionsModal from "./moment-actions-modal";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".aac"];

function inferMediaType(mediaUrl: string): "photo" | "video" | "audio" {
  const lower = mediaUrl.toLowerCase();
  if (VIDEO_EXTENSIONS.some((ext) => lower.includes(ext))) return "video";
  if (AUDIO_EXTENSIONS.some((ext) => lower.includes(ext))) return "audio";
  return "photo";
}

export default function MomentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageHeight = 320;

  const [showActionsModal, setShowActionsModal] = useState(false);
  const [moment, setMoment] = useState<IMoment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMoment = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await getMomentById(id);
      if (response.success && response.data) {
        setMoment(response.data);
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

  const handleEdit = () => {
    // TODO: Navigate to edit screen
  };

  const handleDelete = () => {
    if (!moment) return;

    Alert.alert(
      "Delete Moment",
      "Are you sure you want to delete this moment? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDelete },
      ],
    );
  };

  const confirmDelete = async () => {
    if (!moment) return;

    try {
      await deleteMoment(moment.id);
      Toast.show({ type: "success", text1: "Moment deleted successfully" });
      router.back();
    } catch (err) {
      console.error("Error deleting moment:", err);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: err instanceof Error ? err.message : "Please try again.",
      });
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
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to save media to your gallery",
          [{ text: "OK" }],
        );
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(moment.mediaUrl);
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
    } catch (err) {
      console.error("Error saving to gallery:", err);
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
    // TODO: Implement share
  };

  const handleAddToCollection = () => {
    // TODO: Implement add to collection
  };

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

  const mediaType = moment.mediaUrl ? inferMediaType(moment.mediaUrl) : "photo";
  const categoryKey = (moment.collection || moment.feeling || "random")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title={moment.collection || moment.feeling || "Moment"}
        showRightButton
        showBackButton
        rightButtonOnPress={() => setShowActionsModal(true)}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Media Section */}
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
            {moment.mediaUrl && mediaType === "photo" ? (
              <Image
                source={{ uri: moment.mediaUrl }}
                style={{ width: "100%", height: imageHeight * 1.5 }}
                resizeMode="cover"
              />
            ) : moment.mediaUrl && mediaType === "video" ? (
              <VideoPlayer
                uri={moment.mediaUrl}
                width="100%"
                height={imageHeight * 1.5}
                showControls
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
                    mediaType === "video"
                      ? "videocam"
                      : mediaType === "audio"
                        ? "mic"
                        : "document-text"
                  }
                  size={64}
                  color="#9CA3AF"
                />
              </View>
            )}
          </Animated.View>

          {/* Category Badge */}
          <View className="absolute top-4 right-4">
            <View
              className={`${getCategoryColor(categoryKey)} rounded-full px-3 py-1 flex-row items-center`}
            >
              <Ionicons
                name={getCategoryIcon(categoryKey) as any}
                size={12}
                color="white"
              />
              <Text className="font-sora-medium text-white text-xs ml-1">
                {(moment.collection || moment.feeling || "Moment")
                  .charAt(0)
                  .toUpperCase() +
                  (moment.collection || moment.feeling || "Moment").slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="p-4">
          {moment.description && (
            <Text className="font-sora text-gray-800 text-base leading-6 mb-6">
              {moment.description}
            </Text>
          )}

          {moment.feeling && (
            <View className="mb-6">
              <Text className="font-sora-semibold text-gray-700 text-sm mb-3">
                Feeling
              </Text>
              <Text className="font-sora text-gray-600 text-base capitalize">
                {moment.feeling}
              </Text>
            </View>
          )}

          <View className="mb-6">
            <Text className="font-sora text-gray-600 text-sm">
              {formatDateAndTime(new Date(moment.createdAt))}
            </Text>
          </View>
        </View>
      </ScrollView>

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
