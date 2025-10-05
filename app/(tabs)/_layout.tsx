import AuthGuard from "@/components/AuthGuard";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <AuthGuard>
      <NativeTabs>
        <NativeTabs.Trigger name="moments">
          <Label>Moments</Label>
          <Icon sf="heart.fill" drawable="ic_menu_mylocation" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="add-moment">
          <Label>Add Moment</Label>
          <Icon sf="camera.fill" drawable="ic_menu_camera" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon sf="person.fill" drawable="ic_menu_camera" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </AuthGuard>
  );
}
