import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VideoPlayerProps {
  uri: string;
  width?: number | string;
  height?: number | string;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export default function VideoPlayer({
  uri,
  width = "100%",
  height = 280,
  showControls = true,
  autoPlay = false,
  loop = false,
  muted = true,
  className = "",
}: VideoPlayerProps) {
  const [status, setStatus] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<Video>(null);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const handleLoad = (loadStatus: any) => {
    setIsLoading(false);
    setStatus(loadStatus);
  };

  const handlePlaybackStatusUpdate = (playbackStatus: any) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded) {
      setIsPlaying(playbackStatus.isPlaying);
    }
  };

  return (
    <View className={`relative ${className}`} style={{ width, height }}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={[styles.video, { width, height }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay={autoPlay}
        isLooping={loop}
        isMuted={muted}
        onLoad={handleLoad}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        useNativeControls={showControls}
      />

      {/* Custom Play/Pause Button Overlay */}
      {!showControls && !isLoading && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          <View style={styles.playButtonContainer}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color="white"
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Ionicons name="hourglass-outline" size={32} color="white" />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}

      {/* Video Duration Badge */}
      {status.isLoaded && status.durationMillis && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {Math.floor(status.durationMillis / 1000)}s
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    borderRadius: 0,
  },
  playButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
