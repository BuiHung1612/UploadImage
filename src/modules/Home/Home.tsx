import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Home = () => {
    const formData = new FormData();
    const [image, setImage] = useState('')
    const captureHandle = async function (cameraa: any) {
        try {
            const options = { quality: 0.5, base64: true };
            const data = await cameraa.takePictureAsync(options);
            setImage(data.uri);
            console.log('data.uri', data);
            const filePath = data.uri;
            const newFilePath = RNFS.ExternalDirectoryPath + '/MyTest.jpg';
            RNFS.moveFile(filePath, newFilePath)
                .then(() => {
                    console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {

        }

    };
    const [result, setResult] = useState('')
    const [visible, setVisible] = useState(false)
    const [{ cameraRef }, { takePicture }] = useCamera(null);
    const pickMultiple = () => {
        ImagePicker.openPicker({
            multiple: true,
        })
            .then((images) => {
                console.log('images', images);
                images.map((item, index) => (
                    console.log('height', item.height)

                ))
                // images.map((item, index) => {
                //     formData.append("image", {
                //         uri: item.path,
                //         type: 'image/jpeg',
                //         name: item.filename || `temp_img${index}.jpg`
                //     })
                // })
                // console.log(JSON.stringify(formData));
                formData.append("image", {
                    name: images[0]?.path,
                    size: images[0].size,
                    width: images[0].width,
                    height: images[0].height
                })

                axios({
                    method: "post",
                    url: "https://615bf40ec298130017735e3f.mockapi.io/uploadImage",
                    data: {
                        name: images[0].path,
                        size: images[0].size,
                        width: images[0].width,
                        height: images[0].height
                    },
                    headers: {
                        Accept: 'application/x-www-form-urlencode',
                        Authorization: "Client-ID 215bf545cbd0199"
                    },
                }).then(data => console.log(data)


                ).then(data => console.log(data))

            })
            .catch((e) => Alert.alert(e));
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Text>hello</Text>
            </TouchableOpacity>
            <Modal visible={visible}>
                <RNCamera
                    ref={cameraRef}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                >

                    {({ camera }) => {
                        return (
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => pickMultiple()} style={{ position: 'absolute', left: 20, bottom: 40 }}>
                                    <Image source={{ uri: 'http://www.typeoff.de/wp-images/dan_news/typo-berlin-2008-img-dot.gif' }} style={{ width: 80, height: 80 }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.capture} onPress={() => captureHandle(camera)}>
                                    <Text style={{ fontSize: 14 }}> SNAP </Text>
                                </TouchableOpacity>
                                {image != '' ? <Image source={{ uri: image }} style={{ width: 100, height: 130, position: 'absolute', bottom: 40, right: 20 }} /> : null}

                            </View>
                        )
                    }}
                </RNCamera>
            </Modal>
        </View>


    )
}

export default Home


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
