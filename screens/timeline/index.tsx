import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MomentService } from "../../services/MomentService";
import { Moment } from "../../types";

export default function TimelineScreenComponent() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [filteredMoments, setFilteredMoments] = useState<Moment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMoments = async () => {
    try {
      const momentsData = await MomentService.getMoments();
      setMoments(momentsData);
      setFilteredMoments(momentsData);
    } catch (error) {
      console.error("Error loading moments:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMoments();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await MomentService.searchMoments(query);
        setFilteredMoments(searchResults);
      } catch (error) {
        console.error("Error searching moments:", error);
        setFilteredMoments(moments);
      }
    } else {
      setFilteredMoments(moments);
    }
  };

  useEffect(() => {
    loadMoments();
  }, []);

  const renderMoment = ({ item }: { item: Moment }) => (
    <View className="bg-white rounded-lg p-4 mb-4 mx-4 shadow-sm border border-gray-100">
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
          className="w-full h-48 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}

      {item.mediaUrl &&
        (item.mediaType === "video" || item.mediaType === "audio") && (
          <TouchableOpacity className="bg-gray-100 rounded-lg p-4 mb-3 items-center">
            <Ionicons
              name={
                item.mediaType === "video" ? "play-circle" : "musical-notes"
              }
              size={32}
              color="#3B82F6"
            />
            <Text className="font-sora text-gray-700 mt-2">
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
        <Text className="font-sora text-gray-600">Loading your moments...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 font-sora text-gray-900"
            placeholder="Search your moments..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredMoments}
        renderItem={renderMoment}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="happy-outline" size={64} color="#9CA3AF" />
            <Text className="font-sora-bold text-gray-900 text-xl mt-4 mb-2">
              {searchQuery ? "No moments found" : "No moments yet"}
            </Text>
            <Text className="font-sora text-gray-600 text-center px-8">
              {searchQuery
                ? "Try searching with different keywords"
                : "Start capturing your happy moments by tapping the camera button below!"}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      />
    </View>
  );
}
