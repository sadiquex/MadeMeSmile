import { Ionicons } from "@expo/vector-icons";
import {
  Camera01Icon,
  FavouriteIcon,
  Home05Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2b2c32",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#1F2937",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide this tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          href: null,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={Home05Icon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: "Memories",
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={FavouriteIcon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-moment"
        options={{
          title: "Add Moment",
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={Camera01Icon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
