import { Ionicons } from "@expo/vector-icons";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MediaFile, MediaService } from "../../services/MediaService";
import { MomentService } from "../../services/MomentService";
import {
  COLLECTION_OPTIONS,
  DEFAULT_CATEGORIES,
  MOOD_OPTIONS,
} from "../../types";

export default function AddMoment() {
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("random");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);

  const handleSaveMoment = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please write something about your moment");
      return;
    }

    setIsSaving(true);
    try {
      await MomentService.saveMoment({
        content: content.trim(),
        mediaType: mediaFile ? mediaFile.type : "text",
        mediaUrl: mediaFile?.uri,
        category: selectedCategory,
        collection: selectedCollection || undefined,
        tags,
        mood: selectedMood as any,
      });

      Alert.alert("Success!", "Your moment has been saved! 🎉", [
        {
          text: "OK",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Reset form
            setContent("");
            setSelectedCategory("random");
            setSelectedMood("");
            setSelectedCollection("");
            setTags([]);
            setNewTag("");
            setMediaFile(null);
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving moment:", error);
      Alert.alert("Error", "Failed to save your moment. Please try again.");
    } finally {
      setIsSaving(false);
    }
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

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 gap-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-2xl font-sora-bold text-gray-900">
            What made you smile today?
          </Text>
          <Text className="text-gray-600 font-sora">
            Capture your happy moments and save them forever
          </Text>
        </View>

        {/* Content Input */}
        <View className="">
          <Text className="font-sora-medium text-gray-900 mb-3">
            Tell us about your moment
          </Text>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <TextInput
              className="font-sora text-gray-900 min-h-[30px] text-base"
              placeholder="Share what made you smile today..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={280}
            />
            <Text className="font-sora text-gray-400 text-xs mt-2 text-right">
              {content.length}/280
            </Text>
          </View>
        </View>

        {/* Category Selection */}
        <View className="">
          <Text className="font-sora-medium text-gray-900 mb-3">Category</Text>
          <View className="flex-row flex-wrap gap-3">
            {DEFAULT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`${
                  selectedCategory === category.id
                    ? "bg-yellow-400"
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
                      ? "text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mood Selection */}
        <View className="">
          <Text className="font-sora-medium text-gray-900 mb-3">
            How are you feeling?
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                className={`${
                  selectedMood === mood.id
                    ? "bg-yellow-400"
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
                    selectedMood === mood.id ? "text-gray-800" : "text-gray-600"
                  }`}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View className="">
          <Text className="font-sora-medium text-gray-900 mb-3">
            Hashtags? (Optional)
          </Text>

          {/* Add Tag Input */}
          <View className="flex-row items-center mb-3">
            <TextInput
              className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 font-sora text-gray-900"
              placeholder="Add some hashtags..."
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity
              className="ml-3 bg-blue-500 rounded-lg px-4 py-3"
              onPress={addTag}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Display Tags */}
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
        </View>

        {/* Media Section */}
        <View className="">
          {mediaFile ? (
            <View className="bg-white rounded-lg p-4 border border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
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
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {mediaFile.type === "photo" && (
                <Image
                  source={{ uri: mediaFile.uri }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              )}

              {(mediaFile.type === "video" || mediaFile.type === "audio") && (
                <View className="bg-gray-100 rounded-lg p-4 items-center">
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
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
              onPress={handleAddMedia}
            >
              <HugeiconsIcon icon={Camera01Icon} />

              <Text className="font-sora-medium text-gray-700 mt-2">
                Add Photo, Video, or Audio
              </Text>
              {/* <Text className="font-sora text-gray-500 text-sm mt-1">
                Tap to capture or choose from gallery
              </Text> */}
            </TouchableOpacity>
          )}
        </View>

        {/* Collection Selection */}
        <View className="">
          <Text className="font-sora-medium text-gray-900 mb-3">
            Save to Collection (optional)
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {COLLECTION_OPTIONS.map((collection) => (
              <TouchableOpacity
                key={collection.value}
                className={`${
                  selectedCollection === collection.value
                    ? "bg-purple-500"
                    : "bg-white border border-gray-200"
                } px-4 py-1 rounded-full items-center`}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCollection(collection.value);
                }}
              >
                <Text
                  className={`font-sora text-xs ${
                    selectedCollection === collection.value
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {collection.icon} {collection.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`${
            isSaving ? "bg-gray-400" : "bg-blue-500"
          } rounded-lg py-3`}
          onPress={handleSaveMoment}
          disabled={isSaving}
        >
          <Text className="text-white text-center font-sora-bold text-lg">
            {isSaving ? "Saving..." : "Save Moment"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
