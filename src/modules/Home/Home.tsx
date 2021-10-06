import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert, TextInput, Modal } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Home = () => {
    const formData = new FormData();
    const [image, setImage] = useState('')
    const takePicture = async function (cameraa: any) {
        const options = { quality: 0.5, base64: true };
        const data = await cameraa.takePictureAsync(options);
        setImage(data.uri);
        console.log('data.uri', data);

    };
    const [result, setResult] = useState('')
    const [visible, setVisible] = useState(false)

    const pickMultiple = () => {
        ImagePicker.openPicker({
            multiple: true,
        })
            .then((images) => {
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
                    size: 'image/jpeg',
                })

                axios({
                    method: "post",
                    url: "https://615bf40ec298130017735e3f.mockapi.io/uploadImage",
                    data: {
                        name: images[0].path,
                        size: '5555'
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
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                >

                    {({ camera }) => {
                        return (
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => pickMultiple()} style={{ position: 'absolute', left: 20, bottom: 40 }}>
                                    <Image source={{ uri: 'https://img-premium.flaticon.com/png/512/4225/premium/4225950.png?token=exp=1633404125~hmac=992393b1c30f63fb4e828ddc42dc6a3b' }} style={{ width: 80, height: 80 }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.capture} onPress={() => takePicture(camera)}>
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
