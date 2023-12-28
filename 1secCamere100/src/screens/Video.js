import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VideoScreen({ route }) {
 const { item } = route.params;
 const videoFileName = item;
 const videoRef = useRef(null);
 const [isVideoReady, setIsVideoReady] = useState(false);
 const [videoDate, setVideoDate] = useState(null);
 const [isPlaying, setIsPlaying] = useState(false);

 useEffect(() => {
    const loadVideoFile = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}${videoFileName}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists) {
          setVideoDate(item.date);
        } else {
          console.log('Video file does not exist');
        }
      } catch (error) {
        console.log('Error loading video file:', error);
      }
    };

    loadVideoFile();
 }, []);

 const playVideo = async () => {
    try {
      const playbackObject = videoRef.current;

      if (playbackObject) {
        if (isPlaying) {
          await playbackObject.pauseAsync();
        } else {
          await playbackObject.replayAsync();
        }

        setIsPlaying(!isPlaying);
        setIsVideoReady(true);
      } else {
        console.log('Playback object is null');
      }
    } catch (error) {
      console.log('Error playing video:', error);
    }
 };

 return (
    <View style={styles.container}>
      {videoDate && <Text style={styles.videoDateText}>{videoDate}</Text>}
      <Video
        ref={videoRef}
        source={{
          uri: `${FileSystem.documentDirectory}${videoFileName}`,
        }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={isVideoReady}
        style={styles.videoPlayer}
      />
      <TouchableOpacity onPress={playVideo} style={styles.playButton}>
        <MaterialCommunityIcons
          name={isPlaying ? 'pause' : 'play'}
          size={36}
          color="white"
        />
      </TouchableOpacity>
    </View>
 );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'black',
  },
  videoPlayer: {
     width: '100%',
     height: '70%',
  },
  videoDateText: {
     color: 'white',
     fontSize: 16,
     marginBottom: 10,
  },
  playButton: {
     position: 'absolute',
     top: 0,
     bottom: 0,
     left: 0,
     right: 0,
     justifyContent: 'center',
     alignItems: 'center',
  },
 });