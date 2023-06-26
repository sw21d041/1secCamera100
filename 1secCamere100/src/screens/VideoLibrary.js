import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';

const VideoLibraryScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      const videosDirectory = FileSystem.documentDirectory;
      const files = await FileSystem.readDirectoryAsync(videosDirectory);
      let videoFiles;
      Platform.OS === 'android'
        ? (videoFiles = files.filter((file) => file.endsWith('.mp4')))
        : (videoFiles = files.filter((file) => file.endsWith('.mov')));
      setVideos(videoFiles);
    })();
  }, []);

  const handleDeleteVideo = async (item) => {
    try {
      const videoPath = `${FileSystem.documentDirectory}${item}`;
      await FileSystem.deleteAsync(videoPath);
      setVideos((prevVideos) => prevVideos.filter((video) => video !== item));
    } catch (error) {
      console.log('Error deleting video:', error);
    }
  };

  const confirmDeleteVideo = (item) => {
    Alert.alert('Delete Video', 'Are you sure you want to delete this video?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteVideo(item) },
    ]);
  };

  const handleVideoPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  const togglePlayback = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <Text>No recorded videos found</Text>
      ) : (
        <>
          {currentVideoIndex < videos.length ? (
            <Video
              source={{ uri: `${FileSystem.documentDirectory}${videos[currentVideoIndex]}` }}
              style={styles.videoPlayer}
              shouldPlay={isPlaying}
              resizeMode="contain"
              onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
            />
          ) : (
            <Text>All videos played</Text>
          )}
          <View style={styles.controls}>
            <TouchableOpacity onPress={togglePlayback} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>{isPlaying ? 'Stop' : 'Play'}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={videos}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoItem}
                onPress={() => {
                  navigation.navigate('Video', { item: item });
                }}
                onLongPress={() => confirmDeleteVideo(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 300,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
  },
  controlButtonText: {
    color: 'white',
  },
  videoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
});

export default VideoLibraryScreen;
