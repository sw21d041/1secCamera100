import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const VideoLibraryScreen = ({ navigation }) => {
  const [videos, setVideos] = useState({});

  useEffect(() => {
    (async () => {
      const videosDirectory = FileSystem.documentDirectory;
      const files = await FileSystem.readDirectoryAsync(videosDirectory);
      let videoFiles;
      Platform.OS === "android"? videoFiles = files.filter((file) => file.endsWith(['.mp4'])) : videoFiles = files.filter((file) => file.endsWith(['.mov'])) 
      // const videoFiles = files.filter((file) => file.endsWith(['.mp4','.mov'])); 
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
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteVideo(item) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <Text>No recorded videos found</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.videoItem}
              onPress={() => { navigation.navigate('Video', { item: item }); }}
              onLongPress={() => confirmDeleteVideo(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
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
  videoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
});

export default VideoLibraryScreen;
