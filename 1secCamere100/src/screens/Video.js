import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text,TouchableOpacity, DatePickerIOSBase } from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';



export default function VideoScreen({ route,videoDate ,videoUrl}) {

  const { item } = route.params;
  const videoFileName = item;
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const loadVideoFile = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}${videoFileName}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists) {
          playVideo(fileUri);
        } else {
          console.log('Video file does not exist');
        }
      } catch (error) {
        console.log('Error loading video file:', error);
      }
    };

    loadVideoFile();
  }, []);

  const playVideo = async (videoUri) => {
    try {
      const playbackObject = await Video.createAsync(
        { uri: videoUri },
        { shouldPlay: true }
      );

      if (playbackObject && playbackObject.status && playbackObject.status.isLoaded) {
        videoRef.current.setNativeProps({ source: playbackObject });
        setIsVideoReady(true);
      } else {
        console.log('Failed to load video:', playbackObject);
      }
    } catch (error) {
      console.log('Error playing video:', error);
    }
  };

  const fileUri = `${FileSystem.documentDirectory+"/"+item}`;


  return (
    <View style={styles.container}>
      {/* <Text>{fileUri}</Text> */}
      <Video
  source={{ uri: fileUri }}
  shouldPlay
  resizeMode="cover"
  style={{ width: '100%', height: 400 }}
/>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black'
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    aspectRatio: 16 / 9,
  },
});