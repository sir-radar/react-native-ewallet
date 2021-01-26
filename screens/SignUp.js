import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {COLORS, SIZES, FONTS, icons, images} from '../constants';

const SignUp = ({navigation}) => {
  const [showPassword, setShowPassord] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then((res) => res.json())
      .then((data) => {
        let areaData = data.map((item) => {
          return {
            code: item.alpha2Code,
            name: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://www.countryflags.io/${item.alpha2Code}/flat/64.png`,
          };
        });
        setAreas(areaData);

        if (areaData.length > 0) {
          let defaultData = areaData.filter((a) => a.code == 'US');
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);

  function renderHeader() {
    return (
      <TouchableOpacity
        style={styles.header}
        onPress={() => console.log('Sign up')}>
        <Image
          source={icons.back}
          resizeMode="contain"
          style={styles.headerImage}
        />

        <Text style={styles.headerText}>Sign Up</Text>
      </TouchableOpacity>
    );
  }

  function renderLogo() {
    return (
      <View style={styles.logo}>
        <Image
          source={images.wallieLogo}
          resizeMode="contain"
          style={styles.w_60}
        />
      </View>
    );
  }

  function renderForm() {
    return (
      <View style={[styles.mt_3, styles.mx_3]}>
        <View style={styles.mt_3}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>

        <View style={styles.mt_2}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.flex_row}>
            <TouchableOpacity
              style={[
                styles.w_100,
                styles.h_50,
                styles.mx_5,
                styles.country_code,
              ]}
              onPress={() => setModalVisible(true)}>
              <View style={{justifyContent: 'center', marginRight: 2}}>
                <Image
                  source={icons.down}
                  style={{
                    width: 10,
                    height: 10,
                    tintColor: COLORS.white,
                  }}
                />
              </View>
              <View style={{justifyContent: 'center', marginRight: 5}}>
                <Image
                  source={{uri: selectedArea?.flag}}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 5}}>
                <Text style={{color: COLORS.white, ...FONTS.body3}}>
                  {selectedArea?.callingCode}
                </Text>
              </View>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.full]}
              placeholder="Enter Phone Number"
              placeholderTextColor={COLORS.white}
              selectionColor={COLORS.white}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.mt_2}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassord(!showPassword)}>
            <Image
              source={showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderButton() {
    return (
      <View
        style={{
          margin: SIZES.padding * 3,
        }}>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('Home')}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderAreaCodeModal() {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            padding: SIZES.padding,
            flexDirection: 'row',
          }}
          onPress={() => {
            setSelectedArea(item);
            setModalVisible(false);
          }}>
          <Image
            source={{uri: item.flag}}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
            }}
          />
          <Text style={{...FONTS.body4}}>{item.name}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.lightGreen,
                borderRadius: SIZES.radius,
              }}>
              <FlatList
                data={areas}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                style={{
                  padding: SIZES.padding * 2,
                  marginBottom: SIZES.padding * 2,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.full}>
      <LinearGradient
        colors={[COLORS.lime, COLORS.emerald]}
        style={styles.full}>
        <ScrollView>
          {renderHeader()}
          {renderLogo()}
          {renderForm()}
          {renderButton()}
        </ScrollView>
      </LinearGradient>
      {renderAreaCodeModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  logo: {
    marginTop: SIZES.padding * 5,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h_50: {
    height: 50,
  },
  w_100: {
    width: 100,
  },
  w_60: {
    width: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding * 6,
    paddingHorizontal: SIZES.padding * 2,
  },
  headerImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  headerText: {
    marginLeft: SIZES.padding * 1.5,
    color: COLORS.white,
    ...FONTS.h4,
  },
  mt_2: {
    marginTop: SIZES.padding * 2,
  },
  mt_3: {
    marginTop: SIZES.padding * 3,
  },
  mx_3: {
    marginHorizontal: SIZES.padding * 3,
  },
  mx_5: {
    marginHorizontal: 5,
  },
  inputLabel: {
    color: COLORS.lightGreen,
    ...FONTS.body3,
  },
  input: {
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.white,
    ...FONTS.body3,
  },
  flex_row: {
    flexDirection: 'row',
  },
  country_code: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    flexDirection: 'row',
    ...FONTS.body2,
  },
});

export default SignUp;
