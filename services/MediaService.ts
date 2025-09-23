import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export interface MediaFile {
  uri: string;
  type: "photo" | "video" | "audio";
  name: string;
  size?: number;
}

export class MediaService {
  // Request camera permissions
  static async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting camera permissions:", error);
      return false;
    }
  }

  // Request media library permissions
  static async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting media library permissions:", error);
      return false;
    }
  }

  // Request audio permissions
  static async requestAudioPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting audio permissions:", error);
      return false;
    }
  }

  // Take a photo with camera
  static async takePhoto(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Camera permission is needed to take photos."
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "photo",
          name: `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
      }
      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
      return null;
    }
  }

  // Record a video
  static async recordVideo(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Camera permission is needed to record videos."
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 30, // 30 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "video",
          name: `video_${Date.now()}.mp4`,
          size: asset.fileSize,
        };
      }
      return null;
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Failed to record video. Please try again.");
      return null;
    }
  }

  // Record audio
  static async recordAudio(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestAudioPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Microphone permission is needed to record audio."
        );
        return null;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      // Show recording UI and wait for user to stop
      return new Promise((resolve) => {
        Alert.alert(
          "Recording Audio",
          "Tap 'Stop Recording' when you're done.",
          [
            {
              text: "Stop Recording",
              onPress: async () => {
                try {
                  await recording.stopAndUnloadAsync();
                  const uri = recording.getURI();
                  if (uri) {
                    resolve({
                      uri,
                      type: "audio",
                      name: `audio_${Date.now()}.m4a`,
                    });
                  } else {
                    resolve(null);
                  }
                } catch (error) {
                  console.error("Error stopping recording:", error);
                  resolve(null);
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: async () => {
                try {
                  await recording.stopAndUnloadAsync();
                } catch (error) {
                  console.error("Error canceling recording:", error);
                }
                resolve(null);
              },
            },
          ]
        );
      });
    } catch (error) {
      console.error("Error recording audio:", error);
      Alert.alert("Error", "Failed to record audio. Please try again.");
      return null;
    }
  }

  // Pick photo from gallery
  static async pickPhoto(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Photo library permission is needed to select photos."
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "photo",
          name: `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
      }
      return null;
    } catch (error) {
      console.error("Error picking photo:", error);
      Alert.alert("Error", "Failed to select photo. Please try again.");
      return null;
    }
  }

  // Pick video from gallery
  static async pickVideo(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Photo library permission is needed to select videos."
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 30,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "video",
          name: `video_${Date.now()}.mp4`,
          size: asset.fileSize,
        };
      }
      return null;
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to select video. Please try again.");
      return null;
    }
  }

  // Show media selection options
  static async showMediaOptions(): Promise<MediaFile | null> {
    return new Promise((resolve) => {
      Alert.alert(
        "Add Media",
        "Choose how you'd like to add media to your moment",
        [
          {
            text: "Take Photo",
            onPress: async () => {
              const media = await this.takePhoto();
              resolve(media);
            },
          },
          {
            text: "Record Video",
            onPress: async () => {
              const media = await this.recordVideo();
              resolve(media);
            },
          },
          {
            text: "Record Audio",
            onPress: async () => {
              const media = await this.recordAudio();
              resolve(media);
            },
          },
          {
            text: "Choose from Gallery",
            onPress: async () => {
              const media = await this.showGalleryOptions();
              resolve(media);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(null),
          },
        ]
      );
    });
  }

  // Show gallery options
  static async showGalleryOptions(): Promise<MediaFile | null> {
    return new Promise((resolve) => {
      Alert.alert(
        "Choose from Gallery",
        "Select the type of media you'd like to choose",
        [
          {
            text: "Photo",
            onPress: async () => {
              const media = await this.pickPhoto();
              resolve(media);
            },
          },
          {
            text: "Video",
            onPress: async () => {
              const media = await this.pickVideo();
              resolve(media);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(null),
          },
        ]
      );
    });
  }
}
