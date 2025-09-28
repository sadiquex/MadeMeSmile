import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="moments">
        <Label>Moments</Label>
        <Icon sf="heart.fill" drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>
      {/* 
      <NativeTabs.Trigger name="home">
  <Label>Home</Label>
  <Icon drawable="@drawable/ic_home" /> 
</NativeTabs.Trigger> */}

      <NativeTabs.Trigger name="add-moment">
        <Label>Add Moment</Label>
        <Icon sf="camera.fill" drawable="ic_menu_camera" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" drawable="ic_menu_camera" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
// export default function TabsLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: "#2b2c32",
//         tabBarInactiveTintColor: "#9CA3AF",
//         tabBarStyle: {
//           backgroundColor: "#FFFFFF",
//           borderTopWidth: 1,
//           borderTopColor: "#E5E7EB",
//           paddingBottom: 5,
//           paddingTop: 5,
//           height: 60,
//         },
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           href: null, // Hide this tab from the tab bar
//         }}
//       />

//       <Tabs.Screen
//         name="moments"
//         options={{
//           title: "Moments",
//           tabBarIcon: ({ color, size }) => (
//             <HugeiconsIcon icon={FavouriteIcon} size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="add-moment"
//         options={{
//           title: "Add Moment",
//           tabBarIcon: ({ color, size }) => (
//             <HugeiconsIcon icon={Camera01Icon} size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
