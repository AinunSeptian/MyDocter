import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Input, Profile} from '../../components';
import {colors, getData, showError, storeData} from '../../utils';
import {Fire} from '../../config';
import {launchImageLibrary} from 'react-native-image-picker';
import {ILNullPhoto} from '../../assets';

const UpdateProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    email: '',
  });

  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(ILNullPhoto);
  const [photoForDB, setPhotoForDB] = useState('');

  useEffect(() => {
    getData('user').then(res => {
      const data = res;
      setPhoto({uri: res.photo});
      setProfile(data);
    });
  }, []);

  const update = () => {
    if (password.length > 0) {
      if (password.length < 6) {
        showError('Password kurang dari 6 karakter');
      } else {
        updatePassword();
        updateProfileData();
        navigation.navigate('MainApp');
      }
    } else {
      updateProfileData();
      navigation.navigate('MainApp');
    }
  };

  const updatePassword = () => {
    Fire.auth().onAuthStateChanged(user => {
      if (user) {
        user.updatePassword(password).catch(err => {
          showError(err.message);
        });
      }
    });
  };

  const updateProfileData = () => {
    const data = profile;
    data.photo = photoForDB;
    Fire.database()
      .ref(`users/${profile.uid}/`)
      .update(data)
      .then(() => {
        storeData('user', data);
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const changeText = (key, value) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const getImage = () => {
    launchImageLibrary(
      {quality: 0.5, maxHeight: 200, maxWidth: 200, includeBase64: true},
      response => {
        if (response.didCancel || response.error) {
          showError('oops, sepertinya anda tidak memilih fotonya?');
        } else {
          const source = {uri: response.assets[0].uri};

          setPhotoForDB(
            `data:${response.assets[0].type};base64, ${response.assets[0].base64}`,
          );
          setPhoto(source);
        }
      },
    );
  };

  return (
    <View style={styles.page}>
      <Header title="Edit Profile" onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Profile isRemove photo={photo} onPress={getImage} />
          <Gap height={26} />
          <Input
            label="Full Name"
            value={profile.fullName}
            onChangeText={value => changeText('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Pekerjaan"
            value={profile.profession}
            onChangeText={value => changeText('profession', value)}
          />
          <Gap height={24} />
          <Input label="Email" value={profile.email} disable />
          <Gap height={24} />
          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={value => setPassword(value)}
          />
          <Gap height={40} />
          <Button title="Save Profile" onPress={update} />
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {padding: 40, paddingTop: 0},
});
