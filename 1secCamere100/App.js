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
  })}
  tabBarOptions={{
    activeTintColor: 'black',
    inactiveTintColor: 'gray',
    style: styles.tabBarStyle,
  }}
>
  <Tab.Screen options={{ headerShown: false }} name="cameraScreen" component={CameraScreen} />
  <Tab.Screen options={{ headerShown: false }} name="VideoStackComponent" component={VideoStackComponent} />
</Tab.Navigator>

    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#424547',
  // },
  // camera: {
  //   width: '100%',
  //   height: '70%',
  // },
  // controls: {
  //   flexDirection: 'row',
  // },
  // cameraButton: {
  //   backgroundColor: 'white',
  //   borderRadius: 65,
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   marginHorizontal: 10,
  //   height: 100,
  //   width: 100,
  //   marginTop: 10,
  //   marginLeft: 130,
  // },
  // ico1: {
  //   marginLeft: 80,
  //   fontSize: 40,
  //   marginTop: 10,
  //   color: 'white',
  // },
  // buttonText: {
  //   backgroundColor: '#007AFF',
  //   borderRadius: 5,
  //   paddingHorizontal: 5,
  //   paddingVertical: 5,
  //   marginHorizontal: 5,
  //   marginTop: 10,
  // },
  // zoomButton: {
  //   width: 100,
  //   height: 60,
  // },
  // ico2: {
  //   fontSize: 30,
  //   color: 'white',
  //   marginRight: 220,
  // },
  // ico3: {
  //   fontSize: 30,
  //   color: 'white',
  // },
  // ico4: {
  //   fontSize: 40,
  //   color: 'white',
  //   marginTop: 10,
  // },
  tabBarStyle: {
    backgroundColor: '#424547',
    height: 60,
  },
  tabBarIconStyle: {
    marginTop: 5,
  },
});


export default App;