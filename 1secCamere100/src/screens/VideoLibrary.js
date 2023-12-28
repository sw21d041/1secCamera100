import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Button,
  Image,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";


const VideoLibraryScreen = ({ navigation }) => {
  const [videos, setVideos] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const videosDirectory = FileSystem.documentDirectory;
      const files = await FileSystem.readDirectoryAsync(videosDirectory);
      let videoFiles;
      Platform.OS === "android"
        ? (videoFiles = files.filter((file) => file.endsWith([".mp4"])))
        : (videoFiles = files.filter((file) => file.endsWith([".mov"])));
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
      console.log("Error deleting video:", error);
    }
  };

  const confirmDeleteVideo = (item) => {
    Alert.alert("Delete Video", "Are you sure you want to delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteVideo(item),
      },
    ]);
  };

  const generateThumbnail = async () => {
    try {
       const { status } = await Camera.requestPermissionsAsync();
       if (status === "granted") {
         // Proceed with thumbnail generation
         const videosDirectory = FileSystem.documentDirectory;
         const videoFiles = await FileSystem.readDirectoryAsync(videosDirectory);
         const videoPath = `${videosDirectory}${videoFiles[0]}`; // Use the correct index or logic to get the desired video file
         const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath, {
           time: 500,
         });
         setImage(uri);
         console.log(uri);
       } else {
         console.log("Camera permission denied");
       }
    } catch (e) {
       console.warn(e);
    }
   };
   

  

  return (
    <View style={styles.container}>
      <View style={styles.imagecontainer}>
        <Button onPress={generateThumbnail} title="Generate thumbnail" />
        {image && <Image source={{ uri: image }} style={styles.image} />}

        {/* <Text>{image}</Text> */}
      </View>

      {videos.length === 0 ? (
    <Text>No recorded videos found</Text>
  ) : (
    <FlatList
      data={videos}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.videoItem}
          onPress={() => {
            navigation.navigate("Video", { item: item });
          }}
          onLongPress={() => confirmDeleteVideo(item)}
        >
          <Text>{item}</Text>
          {/* {console.log(FileSystem.documentDirectory, item)} */}
          {/* <Text>{item.date}</Text> */}
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
    justifyContent: "center",
    alignItems: "center",
  },
  videoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  imagecontainer: {},
  image: {
    width: 200,
    height: 200,
  },
});

export default VideoLibraryScreen;
