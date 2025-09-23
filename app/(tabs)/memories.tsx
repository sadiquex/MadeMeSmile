import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MomentService } from "../../services/MomentService";
import { Category, DEFAULT_CATEGORIES, Moment } from "../../types";

export default function MemoriesScreen() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [momentsData, categoriesData] = await Promise.all([
        MomentService.getMoments(),
        MomentService.getCategories(),
      ]);
      setMoments(momentsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMoments =
    selectedCategory === "all"
      ? moments
      : moments.filter((moment) => moment.category === selectedCategory);

  const renderMoment = ({ item }: { item: Moment }) => (
    <View className="bg-white rounded-lg p-4 mb-3 mx-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
          <Ionicons name="happy" size={16} color="white" />
        </View>
        <View className="flex-1">
          <Text className="font-sora-medium text-gray-900 text-sm">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
          <Text className="font-sora text-gray-500 text-xs">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {item.mediaType !== "text" && (
          <View className="flex-row items-center">
            <Ionicons
              name={
                item.mediaType === "photo"
                  ? "image"
                  : item.mediaType === "video"
                  ? "videocam"
                  : "mic"
              }
              size={16}
              color="#6B7280"
            />
          </View>
        )}
      </View>

      <Text className="font-sora text-gray-800 mb-3 leading-5">
        {item.content}
      </Text>

      {/* Media Display */}
      {item.mediaUrl && item.mediaType === "photo" && (
        <Image
          source={{ uri: item.mediaUrl }}
          className="w-full h-32 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}

      {item.mediaUrl &&
        (item.mediaType === "video" || item.mediaType === "audio") && (
          <TouchableOpacity className="bg-gray-100 rounded-lg p-3 mb-3 items-center">
            <Ionicons
              name={
                item.mediaType === "video" ? "play-circle" : "musical-notes"
              }
              size={24}
              color="#3B82F6"
            />
            <Text className="font-sora text-gray-700 mt-1 text-sm">
              {item.mediaType === "video"
                ? "Tap to play video"
                : "Tap to play audio"}
            </Text>
          </TouchableOpacity>
        )}

      {item.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {item.tags.map((tag, index) => (
            <View key={index} className="bg-blue-100 rounded-full px-3 py-1">
              <Text className="font-sora text-blue-600 text-xs">#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="font-sora text-gray-600">
          Loading your memories...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-4"
      >
        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`${
              selectedCategory === "all"
                ? "bg-blue-500"
                : "bg-white border border-gray-200"
            } rounded-full px-4 py-2`}
            onPress={() => setSelectedCategory("all")}
          >
            <Text
              className={`font-sora-medium ${
                selectedCategory === "all" ? "text-white" : "text-gray-600"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`${
                selectedCategory === category.id
                  ? "bg-blue-500"
                  : "bg-white border border-gray-200"
              } rounded-full px-4 py-2 flex-row items-center`}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.id ? "white" : "#6B7280"}
              />
              <Text
                className={`ml-2 font-sora-medium ${
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
      </ScrollView>

      {/* Moments List */}
      <FlatList
        data={filteredMoments}
        renderItem={renderMoment}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="heart-outline" size={64} color="#9CA3AF" />
            <Text className="font-sora-bold text-gray-900 text-xl mt-4 mb-2">
              No memories yet
            </Text>
            <Text className="font-sora text-gray-600 text-center px-8">
              {selectedCategory === "all"
                ? "Start creating moments to see them here!"
                : `No ${selectedCategory} memories yet. Try adding some!`}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
