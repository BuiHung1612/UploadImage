import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { Actionsheet } from 'native-base';
import { StyleSheet } from 'react-native'
const Profile = () => {
  const [data, setData] = useState('');
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
  const onHandelClose = () => {
    setIsVisible(false)
  }
  const onImageSelected = (item) => {
    setIsVisible(false)
  }
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.buttonStyles}>
        <Text>Gallery</Text>
      </TouchableOpacity>

      {
        isVisible == true ? (
          <View style={{ maxHeight: 300 }}>
            <FlatList
              data={data}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity style={{ width: '33%', height: 150 }}>
                  <Image
                    style={{
                      flex: 1
                    }}
                    source={{ uri: item.node.image.uri }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
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



