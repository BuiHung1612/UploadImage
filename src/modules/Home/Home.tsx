import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert, TextInput, Modal, Linking, Platform, FlatList } from 'react-native'
import { RNCamera } from 'react-native-camera'
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker'
import BackgroundJob from 'react-native-background-actions';



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
    const [takeAList, setTakeAList] = useState([])
    const [playing, setPlaying] = useState(false)
    const [listImage, setListImage] = useState([])

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
        }
        UploadTask()


    }, [playing])

    const MultipleImage = async (images: any) => {
        setPlaying(true)
        await images?.forEach((item: any, index: any) => {
            const formData = new FormData()
            formData.append("image", {
                uri: item.path,
                type: 'image/jpeg',
                name: 'lasda.jpg'
            })
            axios({
                method: "post",
                url: "https://api.imgur.com/3/upload",
                data: formData,
                headers: {
                    Accept: 'application/x-www-form-urlencode',
                    Authorization: "Client-ID 49581f490d5908f"
                },
            }).then((data) => {
                console.log('Thành công', data.data.data.link)
                listImage.push(data.data.data.link)
                if (index == images.length - 1) {
                    setPlaying(false)
                }

            }
            ).catch(error => {
                console.log('error', error)
            })
        })


    }

    const [image, setImage] = useState('')
    const takePicture = async function (cameraa: any) {
        const options = { quality: 0.5, base64: true, };
        const data = await cameraa.takePictureAsync(options);
        setImage(data.uri);
        takeAList.push(data.uri)
    };
    const [visible, setVisible] = useState(false)

    const pickMultiple = () => {
        ImagePicker.openPicker({
            multiple: true,
            compressImageMaxWidth: 800,
            compressImageMaxHeight: 1024,
            compressImageQuality: 0.8,

        })
            .then((images: any) => {
                MultipleImage(images)
                setVisible(false)
            }
            )
            .catch((e) => Alert.alert(e));
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setVisible(true)} >
                <Text>Click ME</Text>
            </TouchableOpacity>
            <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <FlatList data={takeAList} renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />} />
                <FlatList data={listImage} renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />} />
            </View>

            <Modal visible={visible}>
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}

                >

                    {({ camera }) => {
                        return (
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => pickMultiple()} style={{ padding: 10, backgroundColor: 'gray' }}>
                                    <Text>Click Me</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.capture} onPress={() => takePicture(camera)}>
                                    <Text>Take a Picture</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.capture} onPress={() => setVisible(false)}>
                                    <Text>BACK</Text>
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
        justifyContent: 'center',
        alignItems: 'center'

    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
