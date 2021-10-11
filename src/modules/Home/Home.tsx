import React, { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Modal } from 'native-base';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import BackgroundJob from 'react-native-background-actions';
import BackIcon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showToast } from '../components/utils/ToastUtil';

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
    const [isCameraBack, setIsCameraBack] = useState(true)
    const [takeAList, setTakeAList] = useState([]);
    const [playing, setPlaying] = useState(false);
    const [listImage, setListImage] = useState([]);
    const [showTakeaPicture, SetshowTakeaPicture] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [image, setImage] = useState('');

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
                        showToast({
                            status: 'success',
                            description: " Upload ảnh thành công."
                        });
                        setPlaying(false);
                    }
                }
                )
                .catch(error => {
                    console.log('error', error);
                });
        });
    };

    const takePicture = async function (cameraa: any) {
        const options = { quality: 1, base64: true };
        const data: any = await cameraa.takePictureAsync(options);
        setImage(data?.uri);
        takeAList.push(data?.uri);
    };

    const cancelAll = () => {
        SetshowTakeaPicture(false);
        setShowModal(false);
    }
    const pickMultiple = () => {
        ImagePicker.openPicker({
            multiple: true,
            // mediaType: 'photo',
            compressImageMaxWidth: 800,
            compressImageMaxHeight: 1024,
            compressImageQuality: 0.8,
        })
            .then((images: any) => {

                console.log('images picked', images);
                MultipleImage(images);
                cancelAll()

            }).catch(e => {
                cancelAll()
                console.log('[WARNING]', e.message)

            }
            )

    };

    const screenWidth = useWindowDimensions().width;
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={styles.buttonPress}>
                <Text style={styles.text}>Press Me</Text>
            </TouchableOpacity>
            {
                takeAList.map((e, index) => < Image key={index} source={{ uri: e }} style={{ width: 100, height: 100 }} />)
            }

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxH="340" backgroundColor="white" >
                    <Modal.Body>
                        <TouchableOpacity
                            style={styles.buttonTakephoto}
                            onPress={() => SetshowTakeaPicture(true)}>
                            <Text style={styles.textTakephoto}>Take a Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonTakephoto}
                            onPress={() => pickMultiple()}>

                            <Text style={styles.textTakephoto}>Select Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonTakephoto, { borderBottomWidth: 0 }]}
                            onPress={() => cancelAll()}>
                            <Text style={styles.textTakephoto}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>


            <Modal isOpen={showTakeaPicture} onClose={() => cancelAll()}>
                <RNCamera
                    style={styles.preview}
                    type={isCameraBack == true ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                    flashMode={RNCamera.Constants.FlashMode.on}>
                    {({ camera }) => {
                        return (
                            <View style={{ flex: 1, width: screenWidth }}>

                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => cancelAll()}>
                                    <BackIcon name="arrow-back" size={30} color="white" />
                                </TouchableOpacity>

                                <View style={styles.ViewBottom}>
                                    <TouchableOpacity onPress={() => pickMultiple()} >
                                        {image != '' ? (
                                            <Image
                                                source={{ uri: image }}
                                                style={styles.TakeAPicture}
                                            />
                                        ) : (
                                            <Ionicons
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
                                            size={36}
                                            color="#ffff"
                                            style={{ alignSelf: 'center', justifyContent: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsCameraBack(!isCameraBack)}>
                                        <Ionicons
                                            name="camera-reverse-outline"
                                            size={36}
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
    buttonPress: {
        width: 100,
        height: 46,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 6,
        marginVertical: 10
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

        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.4,
        borderBottomColor: '#d8d8d8',

    },
    textTakephoto: {
        fontSize: 16,
        color: 'black',
        fontWeight: '600',
        flexShrink: 1,
        textAlign: 'right',
    },
});
