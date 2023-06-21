import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons, AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import { FlashMode } from 'expo-camera/build/Camera.types';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [zoom, setZoom] = useState(0);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      const { status } = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  });

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        // cameraRef.stopRecording();
        const { uri } = await cameraRef.current.recordAsync({ maxDuration: 1 });
        // const { uri } = await cameraRef.current.recordAsync();
        
        
        const fileName = uri.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;
        await FileSystem.moveAsync({
          from: uri,
          to: newPath,
        });
        console.log('Video saved at:', newPath);

      } catch (error) {
        console.error('Failed to record video:', error);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleZoomIn = () => {
    if (zoom < 1) {
      setZoom(zoom + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0) {
      setZoom(zoom - 0.1);
    }
  };

  const toggleFlashlight = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  if (hasPermission === null) {
    console.log('Camera not working');
    return <View />;
  } else if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity onPress={handleZoomIn}>
          <AntDesign name="pluscircleo" style={styles.ico2} />
        </TouchableOpacity>
        {Platform.OS === 'android' && (
          <TouchableOpacity onPress={toggleFlashlight}>
            <MaterialCommunityIcons name="lightning-bolt-outline" style={styles.ico5} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleZoomOut}>
          <AntDesign name="minuscircleo" style={styles.ico3} />
        </TouchableOpacity>
      </View>
      <Camera
        style={styles.camera}
        type={cameraType}
        zoom={zoom}
        flashMode={flashMode}
        ref={cameraRef}
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.cameraButton} onPress={startRecording}>
          <View
            style={{
              height: 80,
              width: 80,
              backgroundColor: 'black',
              borderRadius: 65,
              marginLeft: -10,
            }}
          >
            <View
              style={{
                height: 70,
                width: 70,
                backgroundColor: 'red',
                borderRadius: 65,
                marginLeft: 5,
                marginTop: 5,
              }}
            ></View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraType}>
          <Ionicons name="camera-reverse-outline" style={styles.ico1} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424547',
  },
  camera: {
    width: '100%',
    height: '70%',
  },
  controls: {
    flexDirection: 'row',
  },
  cameraButton: {
    backgroundColor: 'white',
    borderRadius: 65,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    height: 100,
    width: 100,
    marginTop: 10,
    marginLeft: 130,
  },
  ico1: {
    marginLeft: 80,
    fontSize: 40,
    marginTop: 10,
    color: 'white',
  },
  buttonText: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginTop: 10,
  },
  zoomButton: {
    width: 100,
    height: 60,
  },
  ico2: {
    fontSize: 30,
    color: 'white',
    marginRight: 220,
  },
  ico3: {
    fontSize: 30,
    color: 'white',
  },
  ico4: {
    fontSize: 40,
    color: 'white',
    marginTop: 10,
  },
  ico5: {
    fontSize: 35,
    color: 'white',
    marginLeft: -120,
  },
});

export default CameraScreen;
