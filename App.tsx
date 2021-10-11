import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Home from './src/modules/Home/Home';
import Profile from './src/modules/Profile/Profile';
import { NativeBaseProvider } from 'native-base';
import UploadIcon from 'react-native-vector-icons/MaterialIcons';
import CameraIcon from 'react-native-vector-icons/Ionicons';
import Test from './src/modules/Test/Test';

const Tab = createBottomTabNavigator();

const App = () => {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        name='Camera 360'
                        component={Home}
                        options={{
                            tabBarLabel: 'Camera',
                            headerShown: true,
                            tabBarIcon: ({ size }) => <CameraIcon name="camera" size={28} />
                        }}
                    />
                    <Tab.Screen
                        name='Upload File'
                        component={Profile}
                        options={{
                            tabBarLabel: 'Upload File',
                            tabBarIcon: ({ size }) => <UploadIcon name="upload-file" size={28} />
                        }}
                    />
                    <Tab.Screen
                        name='Test'
                        component={Test}
                        options={{
                            tabBarLabel: 'Upload File',
                            tabBarIcon: ({ size }) => <UploadIcon name="upload-file" size={28} />
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
    )
}

export default App
