import { Container } from "@/components/ui/container";
import ScreenHeader from "@/components/ui/screen-header";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MomentService } from "../../services/MomentService";
import { Category, DEFAULT_CATEGORIES, Moment } from "../../types";
import SmileCard from "./smile-card";

export default function MemoriesComponent() {
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

  // Create bento grid layout
  const createBentoGrid = (moments: Moment[]) => {
    const gridItems: {
      moment: Moment;
      size: "small" | "medium" | "large";
      span: number;
    }[] = [];

    moments.forEach((moment, index) => {
      // Create different sizes for visual variety
      if (index % 8 === 0 && moments.length > 3) {
        // Large card every 8th item (but not if we have few items)
        gridItems.push({ moment, size: "large", span: 2 });
      } else if (index % 4 === 0) {
        // Medium card every 4th item
        gridItems.push({ moment, size: "medium", span: 1 });
      } else {
        // Small card for most items
        gridItems.push({ moment, size: "small", span: 1 });
      }
    });

    return gridItems;
  };

  const bentoItems = createBentoGrid(filteredMoments);

  const renderBentoGrid = () => {
    const rows: {
      moment: Moment;
      size: "small" | "medium" | "large";
      span: number;
    }[][] = [];
    let currentRow: {
      moment: Moment;
      size: "small" | "medium" | "large";
      span: number;
    }[] = [];
    let currentRowSpan = 0;

    bentoItems.forEach((item) => {
      if (currentRowSpan + item.span > 2) {
        // Start new row
        rows.push([...currentRow]);
        currentRow = [item];
        currentRowSpan = item.span;
      } else {
        currentRow.push(item);
        currentRowSpan += item.span;
      }
    });

    // Add remaining items
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} className="flex-row gap-3 mb-3 px-4">
        {row.map((item, itemIndex) => (
          <View
            key={`${item.moment.id}-${itemIndex}`}
            className={`${item.span === 2 ? "flex-1" : "flex-1"}`}
            style={{ flex: item.span }}
          >
            <SmileCard
              moment={item.moment}
              size={item.size}
              onPress={() => {
                // Handle card press - could navigate to detail view
                console.log("Pressed moment:", item.moment.id);
              }}
            />
          </View>
        ))}
      </View>
    ));
  };

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
    <>
      <ScreenHeader title="Memories" />
      <Container>
        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <View className="flex-row gap-2 bg-red-200">
            <TouchableOpacity
              className={`${
                selectedCategory === "all"
                  ? "bg-blue-500 shadow-sm"
                  : "bg-white border border-gray-300 shadow-sm"
              } rounded-full px-4 py-2.5 flex-row items-center`}
              onPress={() => setSelectedCategory("all")}
              style={{
                shadowColor: selectedCategory === "all" ? "#3B82F6" : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                className={`font-sora-medium text-sm ${
                  selectedCategory === "all" ? "text-white" : "text-gray-700"
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
                    ? "bg-blue-500 shadow-sm"
                    : "bg-white border border-gray-300 shadow-sm"
                } rounded-full px-4 py-2.5 flex-row items-center`}
                onPress={() => setSelectedCategory(category.id)}
                style={{
                  shadowColor:
                    selectedCategory === category.id ? "#3B82F6" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Text
                  className={`font-sora-medium text-sm ${
                    selectedCategory === category.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bento Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {filteredMoments.length === 0 ? (
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
          ) : (
            renderBentoGrid()
          )}
        </ScrollView>
      </Container>
    </>
  );
}
