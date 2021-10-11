import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Image,
    FlatList,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Keyboard,
    Animated
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { Actionsheet } from 'native-base';
import { StyleSheet } from 'react-native'
import { HStack, Checkbox, Center, NativeBaseProvider } from "native-base"
const Profile = () => {
    const [data, setData] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])
    const getPhotos = () => {
        CameraRoll.getPhotos({
            first: 50,
            assetType: 'Photos',
        })
            .then((res) => {
                setData(res.edges);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const askPermission = async () => {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Permission Explanation',
                    message: 'ReactNativeForYou would like to access your photos!',
                    buttonPositive: ''
                },
            );
            if (result !== 'granted') {
                console.log('Access to pictures was denied');
                return;
            } else {
                getPhotos();
            }
        } else {
            getPhotos();
        }
    };

    useEffect(() => {
        askPermission();
    }, []);

    const [isVisible, setIsVisible] = useState(false)
    const [selectImage, setSelectImage] = useState([])
    const [checked, setChecked] = useState(false)
    const [listImageChecked, setListImageChecked] = useState([])
    const onHandelClose = () => {
        setIsVisible(false)
    }
    const onImageSelected = (item: any) => {
        const checkExist = listImageChecked.some((value: string) => value === item)
        if (!checkExist) {
            listImageChecked.push(item)
            console.log(listImageChecked);

        }
        else {
            let checklist = listImageChecked.filter((value: string) => value !== item)

            setListImageChecked(checklist)
            console.log(checklist);
        }
    }
    return (
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* <View style={{ flexDirection: 'row' }}>
        <TextInput placeholder="Nhập văn bản" style={{ borderWidth: 1 }} onFocus={() => setIsVisible(false)} enablesReturnKeyAutomatically={!isVisible} onTouchMove={() => setIsVisible(!isVisible)} />
        <Text onPress={() => {
          Keyboard.dismiss()
          setIsVisible(true)

        }}>image</Text>
      </View> */}
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={styles.buttonStyles}>
                <Text>Gallery</Text>
            </TouchableOpacity>

            {
                isVisible == true ? (
                    <Animated.View style={{ maxHeight: 260, opacity: fadeAnim }} >
                        <FlatList
                            data={data}
                            numColumns={3}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ width: '33%', height: 130 }} onPress={() => onImageSelected(item)} >
                                    <Image
                                        style={{
                                            flex: 1
                                        }}
                                        source={{ uri: item.node.image.uri }}
                                    />
                                    <Checkbox borderRadius={10} accessibilityLabel="This is a dummy checkbox" onChange={() => onImageSelected(item)} marginTop={1} right={2} value="info" position="absolute" />

                                </TouchableOpacity>
                            )}
                        />
                    </Animated.View>
                ) : null
            }



        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    buttonStyles: {
        width: 100,
        height: 46,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5882FA',
        borderRadius: 6,
        marginVertical: 10
    }
})



