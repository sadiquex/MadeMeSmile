import { Container } from "@/components/ui/container";
import ScreenHeader, { HeaderHeightSpace } from "@/components/ui/screen-header";
import { Ionicons } from "@expo/vector-icons";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { MediaFile, MediaService } from "../../services/MediaService";
import {
  addMoment,
  CreateMomentData,
} from "../../services/moments/moments.service";
import { COLLECTION_OPTIONS, MOOD_OPTIONS } from "../../types";
import SaveToCollectionModal from "./save-to-collection-modal";

export default function AddMoment() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("random");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const MEDIA_HEIGHT = SCREEN_HEIGHT * 0.5;

  const handleSaveMoment = async () => {
    // if (!content.trim()) {
    //   Alert.alert("Error", "Please write something about your moment");
    //   return;
    // }

    setIsLoading(true);

    try {
      const momentData: CreateMomentData = {
        content: content.trim(),
        mediaType: mediaFile ? mediaFile.type : "text",
        mediaUrl: mediaFile?.uri,
        category: selectedCategory,
        collection: selectedCollection || undefined,
        tags,
        mood: selectedMood as
          | "happy"
          | "grateful"
          | "excited"
          | "peaceful"
          | undefined,
      };

      await addMoment(momentData);

      Alert.alert("Success!", "Your moment has been saved! 🎉", [
        {
          text: "OK",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Reset form and navigate back
            resetForm();
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving moment:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to save your moment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setSelectedCategory("random");
    setSelectedMood("");
    setSelectedCollection("");
    setTags([]);
    setNewTag("");
    setMediaFile(null);
  };

  const handleAddMedia = async () => {
    try {
      const media = await MediaService.showMediaOptions();
      if (media) {
        setMediaFile(media);
      }
    } catch (error) {
      console.error("Error adding media:", error);
      Alert.alert("Error", "Failed to add media. Please try again.");
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCollectionSelect = (collection: string) => {
    setSelectedCollection(collection);
    setShowCollectionModal(false);
  };

  const getSelectedCollectionLabel = () => {
    const collection = COLLECTION_OPTIONS.find(
      (c) => c.value === selectedCollection
    );
    return collection
      ? `${collection.icon} ${collection.label}`
      : "Add to Collection";
  };

  return (
    <>
      <ScreenHeader title="Add Moment" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Container>
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          >
            <HeaderHeightSpace style={{ height: 110 }} />

            <View className="flex-1 gap-4 mb-[66px]">
              {/* Media Section */}
              <View style={{ height: MEDIA_HEIGHT }}>
                <Text className="font-sora-medium text-gray-900 mb-2">
                  Media
                </Text>

                {mediaFile ? (
                  <View className="bg-white rounded-lg p-4 border border-gray-200 flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <Ionicons
                          name={
                            mediaFile.type === "photo"
                              ? "image"
                              : mediaFile.type === "video"
                              ? "videocam"
                              : "mic"
                          }
                          size={20}
                          color="#3B82F6"
                        />
                        <Text className="font-sora-medium text-gray-900 ml-2 capitalize">
                          {mediaFile.type} attached
                        </Text>
                      </View>
                      <TouchableOpacity onPress={removeMedia}>
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>

                    {mediaFile.type === "photo" && (
                      <Image
                        source={{ uri: mediaFile.uri }}
                        className="w-full flex-1 rounded-lg"
                        resizeMode="cover"
                      />
                    )}

                    {(mediaFile.type === "video" ||
                      mediaFile.type === "audio") && (
                      <View className="bg-gray-100 rounded-lg p-4 items-center flex-1 justify-center">
                        <Ionicons
                          name={
                            mediaFile.type === "video"
                              ? "play-circle"
                              : "musical-notes"
                          }
                          size={48}
                          color="#6B7280"
                        />
                        <Text className="font-sora text-gray-600 mt-2">
                          {mediaFile.type === "video"
                            ? "Video file attached"
                            : "Audio file attached"}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 items-center flex-1 justify-center"
                    onPress={handleAddMedia}
                  >
                    <HugeiconsIcon icon={Camera01Icon} />

                    <Text className="font-sora-medium text-gray-700 mt-2">
                      Add Photo, Video, or Audio
                    </Text>
                    <Text className="font-sora text-gray-500 text-sm mt-1">
                      Tap to capture or choose from gallery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Description */}
              <View className="min-h-[100px]">
                <Text className="font-sora-medium text-gray-900 mb-2">
                  What made you smile today?
                </Text>
                <Textarea
                  value={content}
                  onChangeText={setContent}
                  placeholder="What made you smile today..."
                  maxLength={280}
                  className="border-dashed border-gray-300 text-gray-800 placeholder:text-gray-400 flex-1"
                />
                <Text className="font-sora text-gray-400 text-xs mt-2 text-right">
                  {content.length}/280
                </Text>
              </View>

              {/* Category Selection */}
              {/* <View className="">
                <Text className="font-sora-medium text-gray-900 mb-2">
                  Category
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {DEFAULT_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`${
                        selectedCategory === category.id
                          ? "bg-primary"
                          : "bg-white border border-gray-200"
                      } px-4 py-1 rounded-full items-center`}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedCategory(category.id);
                      }}
                    >
                      <Text
                        className={`font-sora text-xs ${
                          selectedCategory === category.id
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> */}

              {/* Mood Selection */}
              <View className="">
                <Text className="font-sora-medium text-gray-900 mb-2">
                  How are you feeling?
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {MOOD_OPTIONS.map((mood) => (
                    <TouchableOpacity
                      key={mood.id}
                      className={`${
                        selectedMood === mood.id
                          ? "bg-primary"
                          : "bg-white border border-gray-200"
                      } rounded-lg px-4 py-3 items-center`}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedMood(mood.id);
                      }}
                    >
                      <Text className="text-2xl mb-1">{mood.emoji}</Text>
                      <Text
                        className={`font-sora text-xs ${
                          selectedMood === mood.id
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tags */}
              {/* <View className="">
                <Text className="font-sora-medium text-gray-900 mb-2">
                  Hashtags? (Optional)
                </Text>

                <View className="flex-row items-center mb-2">
                  <TextInput
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 font-sora text-gray-900"
                    placeholder="Add some hashtags..."
                    value={newTag}
                    onChangeText={setNewTag}
                    onSubmitEditing={addTag}
                    returnKeyType="done"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="ml-3 bg-primary rounded-lg px-4 py-3"
                    onPress={addTag}
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {tags.length > 0 && (
                  <View className="flex-row flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        className="bg-blue-100 rounded-full px-3 py-2 flex-row items-center"
                        onPress={() => removeTag(tag)}
                      >
                        <Text className="font-sora text-blue-600 text-sm mr-2">
                          #{tag}
                        </Text>
                        <Ionicons name="close" size={14} color="#3B82F6" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View> */}

              {/* Collection Selection */}
              <View className="">
                {/* <Text className="font-sora-medium text-gray-900 mb-2">
                  Add to Collection (optional)
                </Text> */}
                <TouchableOpacity
                  className={`w-full ${
                    selectedCollection
                      ? "text-gray-900"
                      : "border border-gray-200"
                  } rounded-lg px-4 py-3 flex-row items-center justify-between border border-gray-200`}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowCollectionModal(true);
                  }}
                >
                  <Text
                    className={`font-sora text-sm ${
                      selectedCollection ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {getSelectedCollectionLabel()}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={selectedCollection ? "#6B7280" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              <Button onPress={handleSaveMoment} disabled={isLoading}>
                {isLoading && <ActivityIndicator size="small" color="#fff" />}
                <Text className="font-sora-medium text-white">
                  {isLoading ? "Saving..." : "Save Moment"}
                </Text>
              </Button>
            </View>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>

      {/* Collection Modal */}
      <SaveToCollectionModal
        isVisible={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        onSelectCollection={handleCollectionSelect}
        selectedCollection={selectedCollection}
      />
    </>
  );
}
