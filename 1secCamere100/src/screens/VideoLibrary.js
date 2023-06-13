import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';

const VideoLibraryScreen = ({navigation}) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    (async () => {
      const videosDirectory = FileSystem.documentDirectory;
      const files = await FileSystem.readDirectoryAsync(videosDirectory);
      const videoFiles = files.filter((file) => file.endsWith('.mov')); // Filter only MOV files
      setVideos(videoFiles);
    })();
  });

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <Text>No recorded videos found</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (

            <TouchableOpacity style={styles.videoItem} onPress={()=>{navigation.navigate('Video',{item:item})}}>
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