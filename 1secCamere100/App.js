import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, ScrollView, AsyncStorage } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';

export default function App() {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');

      retrieveVideos();
    })();
  }, []);

  const takeVideo = async () => {
    if (camera) {
      const data = await camera.recordAsync({
        maxDuration: 1,
      });
      setRecordings((prevRecordings) => [...prevRecordings, data.uri]);
      console.log(data.uri);
      saveVideo(data.uri);
    }
  };

  const saveVideo = async (videoUri) => {
    try {
      const storedRecordings = await AsyncStorage.getItem('recordings');
      const parsedRecordings = storedRecordings ? JSON.parse(storedRecordings) : [];
      const updatedRecordings = [...parsedRecordings, videoUri];
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
      console.log('Saved video:', videoUri);
    } catch (error) {
      console.log('Error saving video:', error);
    }
  };

  const retrieveVideos = async () => {
    try {
      const storedRecordings = await AsyncStorage.getItem('recordings');
      const parsedRecordings = storedRecordings ? JSON.parse(storedRecordings) : [];
      setRecordings(parsedRecordings);
    } catch (error) {
      console.log('Error retrieving videos:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'3:3'}
        />
      </View>
      {recordings.length > 0 && (
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: recordings[recordings.length - 1],
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        />
      </View>
      <Button
        title="Flip Video"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      />
      <Button title="Take video" onPress={() => takeVideo()} />
      <View style={styles.videoListContainer}>
        <Text style={styles.videoListTitle}>Stored Videos:</Text>
        <ScrollView>
          {recordings.map((item, index) => (
            <View style={styles.videoItem} key={index}>
              <Button title={'video'} onPress={() => video.current.loadAsync({ uri: item })} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  videoListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sview: {
    height: '100px',
  },
});
