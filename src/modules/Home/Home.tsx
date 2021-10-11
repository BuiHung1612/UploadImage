import React, { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert,
    TextInput,
    Linking,
    Platform,
    FlatList,
    useWindowDimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button, Modal, ScrollView } from 'native-base';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import BackgroundJob from 'react-native-background-actions';
import { Actionsheet } from 'native-base';
import BackIcon from 'react-native-vector-icons/Ionicons';
import { alignItems, flexDirection, marginBottom } from 'styled-system';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageIcon from 'react-native-vector-icons/FontAwesome';
import CannelIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const options = {
    taskName: 'UpLoad File',
    taskTitle: 'Đang tải ảnh lên',
    taskDesc: 'UpLoad File ',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#81BEF7',
};

const Home = () => {
    const [takeAList, setTakeAList] = useState([]);
    const [playing, setPlaying] = useState(false);
    const [listImage, setListImage] = useState([]);

    useEffect(() => {
        const UploadTask = async () => {
            if (playing === true) {
                try {
                    console.log('Trying to start background service');
                    await BackgroundJob.start(MultipleImage, options);
                    console.log('Successful start!');
                } catch (e) {
                    console.log('Error', e);
                }
            } else {
                console.log('Stop background service');
                await BackgroundJob.stop();
            }
        };
        UploadTask();
    }, [playing]);

    const MultipleImage = async (images: any) => {
        setPlaying(true);
        await images?.forEach((item: any, index: any) => {
            const formData = new FormData();
            formData.append('image', {
                uri: item.path,
                type: 'image/jpeg',
                name: 'lasda.jpg',
            });
            axios({
                method: 'post',
                url: 'https://api.imgur.com/3/upload',
                data: formData,
                headers: {
                    Accept: 'application/x-www-form-urlencode',
                    Authorization: 'Client-ID 49581f490d5908f',
                },
            })
                .then(data => {
                    console.log('Thành công', data?.data);
                    listImage.push(data?.data?.data?.link);
                    if (index == images.length - 1) {
                        setPlaying(false);
                    }
                })
                .catch(error => {
                    console.log('error', error);
                });
        });
    };

    const [image, setImage] = useState('');
    const takePicture = async function (cameraa: any) {
        const options = { quality: 0.5, base64: true };
        const data: any = await cameraa.takePictureAsync(options);
        setImage(data?.uri);
        takeAList.push(data?.uri);
    };
    const [showTakeaPicture, SetshowTakeaPicture] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const pickMultiple = () => {
        ImagePicker.openPicker({
            multiple: true,
            compressImageMaxWidth: 800,
            compressImageMaxHeight: 1024,
            compressImageQuality: 0.8,
        })
            .then((images: any) => {
                MultipleImage(images);
                SetshowTakeaPicture(false);
                setShowModal(false);
            })
            .catch(e => Alert.alert(e));
    };

    const screenWidth = useWindowDimensions().width;
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={{
                    width: 100,
                    height: 50,
                    marginVertical: 30,
                    borderRadius: 10,
                    backgroundColor: 'gray',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text>Click ME</Text>
            </TouchableOpacity>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxH="340" >
                    <Modal.Body>
                        <TouchableOpacity
                            style={styles.buttonTakephoto}
                            onPress={() => SetshowTakeaPicture(true)}>
                            <Ionicons
                                name="camera"
                                size={26}
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    paddingRight: 10,
                                }}
                            />
                            <Text style={styles.textTakephoto}>Take a Picture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonTakephoto}
                            onPress={() => pickMultiple()}>
                            <ImageIcon
                                name="image"
                                size={26}
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    paddingRight: 10,
                                }}
                            />
                            <Text style={styles.textTakephoto}>Select Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonTakephoto}
                            onPress={() => setShowModal(false)}>
                            <CannelIcon
                                name="exit-to-app"
                                size={26}
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                }}
                            />
                            <Text
                                style={{
                                    marginRight: 50,
                                }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {/* <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text>Danh sách image chụp</Text>
          <FlatList
            data={takeAList}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
          />
        </View>
        <View>
          <Text> Danh sách images tải lên</Text>
          <FlatList
            data={listImage}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
          />
        </View>
      </View> */}

            <Modal isOpen={showTakeaPicture}>
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}>
                    {({ camera }) => {
                        return (
                            <View style={{ flex: 1, width: screenWidth }}>
                                <View>
                                    <TouchableOpacity
                                        style={styles.backButton}
                                        onPress={() => SetshowTakeaPicture(false)}>
                                        <BackIcon name="arrow-back" size={30} color="#ffff" />
                                        {/* <Text>BACK</Text> */}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.ViewBottom}>
                                    <TouchableOpacity onPress={() => pickMultiple()}>
                                        {image != '' ? (
                                            <Image
                                                source={{ uri: image }}
                                                style={styles.TakeAPicture}
                                            />
                                        ) : (
                                            <ImageIcon
                                                name="image"
                                                size={36}
                                                color="#ffff"
                                                style={{ alignSelf: 'center', justifyContent: 'center' }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => takePicture(camera)}>
                                        <Ionicons
                                            name="camera"
                                            size={48}
                                            color="#ffff"
                                            style={{ alignSelf: 'center', justifyContent: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="camera-reverse-outline"
                                            size={48}
                                            color="#ffff"
                                            style={{ alignSelf: 'center', justifyContent: 'center' }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                </RNCamera>
            </Modal>
        </View >
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
        marginHorizontal: 16,
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
    },
    backButton: {
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    TakeAPicture: {
        width: 80,
        height: 80,
    },
    ViewBottom: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginHorizontal: 20,
    },
    buttonTakephoto: {
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8',
        flexDirection: 'row',
        marginHorizontal: 44,
    },
    textTakephoto: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 40,
        flexShrink: 1,
        textAlign: 'right',
    },
});
