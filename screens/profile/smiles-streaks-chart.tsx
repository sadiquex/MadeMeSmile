import BottomModal from "@/components/ui/bottom-modal";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface SmilesStreaksChartProps {
  data?: DailySmileData[];
  onCellPress?: (date: string, count: number) => void;
}

interface DailySmileData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no smiles, 4 = most smiles
}

// Generate mock data for the last 365 days
const generateMockData = (): DailySmileData[] => {
  const data: DailySmileData[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random activity with some patterns
    const random = Math.random();
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;

    if (random > 0.3) {
      // 70% chance of having some activity
      count = Math.floor(Math.random() * 5) + 1;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else level = 4;
    }

    data.push({
      date: date.toISOString().split("T")[0],
      count,
      level,
    });
  }

  return data;
};

const getLevelColor = (level: number): string => {
  switch (level) {
    case 0:
      return "#EBEDF0"; // Light gray
    case 1:
      return "#C6E48B"; // Light green
    case 2:
      return "#7BC96F"; // Medium green
    case 3:
      return "#239A3B"; // Dark green
    case 4:
      return "#196127"; // Darkest green
    default:
      return "#EBEDF0";
  }
};

const getMonthOptions = (): { label: string; value: number }[] => {
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month, index) => ({
    label: `${month} ${currentYear}`,
    value: index,
  }));
};

const getDayLabels = (): string[] => {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
};

export default function SmilesStreaksChart({
  data = generateMockData(),
  onCellPress,
}: SmilesStreaksChartProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthModal, setShowMonthModal] = useState(false);
  const dayLabels = getDayLabels();
  const monthOptions = getMonthOptions();

  // Filter data by selected month
  const filteredData = data.filter((day) => {
    const dayDate = new Date(day.date);
    return dayDate.getMonth() === selectedMonth;
  });

  // Group filtered data by weeks (7 days per row)
  const weeks: DailySmileData[][] = [];
  for (let i = 0; i < filteredData.length; i += 7) {
    weeks.push(filteredData.slice(i, i + 7));
  }

  // Calculate stats for filtered data
  const totalSmiles = filteredData.reduce((sum, day) => sum + day.count, 0);
  const currentStreak = calculateCurrentStreak(filteredData);
  const longestStreak = calculateLongestStreak(filteredData);

  return (
    <View className="bg-white rounded-lg p-4 mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-sora-bold text-gray-900 text-lg">
          Smile Streaks
        </Text>
        <Text className="font-sora text-gray-600 text-sm">
          {totalSmiles} smiles this month
        </Text>
      </View>

      {/* Month Selector */}
      <View className="mb-4">
        <Text className="font-sora-medium text-gray-700 text-sm mb-2">
          Select Month
        </Text>
        <TouchableOpacity
          onPress={() => setShowMonthModal(true)}
          className="bg-gray-100 rounded-lg px-4 py-3 flex-row justify-between items-center"
        >
          <Text className="font-sora text-gray-700">
            {monthOptions[selectedMonth]?.label || "Select Month"}
          </Text>
          <Text className="font-sora text-gray-500">▼</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-between mb-4">
        <View className="items-center">
          <Text className="font-sora-bold text-gray-900 text-xl">
            {totalSmiles}
          </Text>
          <Text className="font-sora text-gray-600 text-xs">Total Smiles</Text>
        </View>

        <View className="items-center">
          <Text className="font-sora-bold text-gray-900 text-xl">
            {currentStreak}
          </Text>
          <Text className="font-sora text-gray-600 text-xs">
            Current Streak
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-sora-bold text-gray-900 text-xl">
            {longestStreak}
          </Text>
          <Text className="font-sora text-gray-600 text-xs">
            Longest Streak
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View className="mb-4">
        {/* Day labels */}
        <View className="flex-row mb-2">
          <View className="w-6" />
          {dayLabels.map((day, index) => (
            <View key={day} className="flex-1 items-center">
              <Text className="font-sora text-gray-500 text-xs">{day}</Text>
            </View>
          ))}
        </View>

        {/* Chart grid */}
        <View className="flex-row">
          {/* Week labels */}
          <View className="w-6 justify-center">
            {weeks.map((_, weekIndex) => (
              <Text
                key={weekIndex}
                className="font-sora text-gray-500 text-xs mb-1"
                style={{
                  height: 12,
                  lineHeight: 12,
                }}
              >
                W{weekIndex + 1}
              </Text>
            ))}
          </View>

          {/* Activity grid */}
          <View className="flex-1">
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} className="flex-row mb-1 ">
                {week.map((day, dayIndex) => (
                  <TouchableOpacity
                    key={`${weekIndex}-${dayIndex}`}
                    onPress={() => onCellPress?.(day.date, day.count)}
                    className="flex-1 aspect-square mr-1 rounded-sm"
                    style={{
                      backgroundColor: getLevelColor(day.level),
                      minWidth: 4,
                      minHeight: 4,
                    }}
                  />
                ))}
                {/* Fill remaining days in the week if needed */}
                {Array.from({ length: 7 - week.length }).map((_, index) => (
                  <View
                    key={`empty-${weekIndex}-${index}`}
                    className="flex-1 aspect-square mr-1"
                    style={{ minWidth: 4, minHeight: 4 }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Legend */}
      <View className="flex-row items-center justify-between">
        <Text className="font-sora text-gray-600 text-xs">Less</Text>
        <View className="flex-row space-x-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <View
              key={level}
              className="w-[4px] h-[4px] rounded-sm"
              style={{ backgroundColor: getLevelColor(level) }}
            />
          ))}
        </View>
        <Text className="font-sora text-gray-600 text-xs">More</Text>
      </View>

      {/* Month Selection Modal */}
      <BottomModal
        isVisible={showMonthModal}
        onClose={() => setShowMonthModal(false)}
        title="Select Month"
        snapPoints={["60%", "70%", "80%", "90%"]}
      >
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          {monthOptions.map((month) => (
            <TouchableOpacity
              key={month.value}
              onPress={() => {
                setSelectedMonth(month.value);
                setShowMonthModal(false);
              }}
              className={`py-4 px-4 border-b border-gray-200 w-full ${
                selectedMonth === month.value ? "bg-blue-50" : "bg-white"
              }`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-sora ${
                    selectedMonth === month.value
                      ? "text-blue-600 font-sora-medium"
                      : "text-gray-700"
                  }`}
                >
                  {month.label}
                </Text>
                {selectedMonth === month.value && (
                  <Text className="text-blue-600 font-sora-bold">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomModal>
    </View>
  );
}

// Helper functions
function calculateCurrentStreak(data: DailySmileData[]): number {
  let streak = 0;
  const today = new Date();

  for (let i = data.length - 1; i >= 0; i--) {
    const dayDate = new Date(data[i].date);
    const daysDiff = Math.floor(
      (today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 1) break; // Gap in days

    if (data[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(data: DailySmileData[]): number {
  let longestStreak = 0;
  let currentStreak = 0;

  for (const day of data) {
    if (day.count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return longestStreak;
}
