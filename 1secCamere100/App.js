import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";

import CameraScreen from './src/screens/cameraScreen';
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
      <Tab.Navigator>
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="VideoLibrary" component={VideoStackComponent} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;