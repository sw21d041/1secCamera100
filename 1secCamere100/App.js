import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from 'react-native-vector-icons';
import { StyleSheet } from 'react-native';

import CameraScreen from './src/screens/cameraScreen'
import VideoLibraryScreen from './src/screens/VideoLibrary';
import VideoScreen from './src/screens/Video';

const Tab = createBottomTabNavigator();
const VideoStack = createNativeStackNavigator();

function VideoStackComponent() {
  return (
    <VideoStack.Navigator>
      <VideoStack.Screen name="VideoLibrary" component={VideoLibraryScreen} />
      <VideoStack.Screen name="Video" component={VideoScreen} />
    </VideoStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'cameraScreen') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'VideoStackComponent') {
              iconName = focused ? 'film' : 'film-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} style={styles.tabBarIconStyle} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBarStyle,
        })}
      >
        <Tab.Screen options={{ headerShown: false }} name="cameraScreen" component={CameraScreen} />
        <Tab.Screen options={{ headerShown: false }} name="VideoStackComponent" component={VideoStackComponent} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#424547',
    height: 75,
  },
  tabBarIconStyle: {
    marginTop: 5,
  },
});

export default App;
