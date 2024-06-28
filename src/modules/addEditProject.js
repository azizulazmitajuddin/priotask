import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DecryptedData, EncryptedData } from '../utils.js/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AddEditProject({ route }) {
  const navigation = useNavigation();
  const routeData = route?.params;

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const [inputProjectName, setInputProjectName] = useState('');
  const [inputSerialNo, setInputSerialNo] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [dateProject, setDate] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);

  const [listProject, setListProject] = useState([]);

  // function for date calendar
  const handleOpenCalendar = () => {
    setOpenCalendar(!openCalendar);
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setOpenCalendar(!openCalendar);
    setDate(currentDate);
  };

  // function for switch encryption
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // function for decrypt data
  const handleUnlock = () => {
    setIsEnabled(false);
    setInputSerialNo(DecryptedData(inputSerialNo));
  };

  // function to decrypt and authenticate
  const handleAuthenticate = () => {
    if (isBiometricSupported) {
      const auth = LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate',
        fallbackLabel: 'Enter Your Password',
      });
      auth.then((result) => {
        handleUnlock();
      });
    }
  };

  // handle delete Project
  const handleDeleteProject = useCallback(async () => {
    const final = listProject.filter(
      (a) => a.projectName !== routeData.projectName && a.dateProject !== routeData.dateProject
    );
    await AsyncStorage.setItem('@list_project', JSON.stringify(final));
    navigation.navigate('Home');
  }, [routeData, listProject]);

  // handle create and completing Project
  const handleSubmit = async () => {
    try {
      const payload = {
        projectName: inputProjectName,
        serialNo: isEnabled ? EncryptedData(inputSerialNo) : inputSerialNo,
        dateCreated: moment().unix(),
        dateProject: moment(dateProject).unix(),
        isEncrypted: routeData?.isEncrypted ? !Boolean(isEnabled) : Boolean(isEnabled),
        isDone: routeData?.screenId === 1,
      };

      if (routeData?.screenId === 1) {
        const temp = listProject?.map((a) => {
          if (a.dateProject === routeData.dateProject && a.ProjectName === routeData.ProjectName) {
            return {
              ...a,
              isDone:
                a.dateProject === routeData.dateProject && a.ProjectName === routeData.projectName,
            };
          } else {
            return a;
          }
        });
        await AsyncStorage.setItem('@list_project', JSON.stringify(temp));
      }

      if (routeData?.screenId === 0) {
        listProject.push(payload);
        if (inputProjectName) {
          await AsyncStorage.setItem('@list_project', JSON.stringify(listProject));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      navigation.navigate('ListBlock', { projectId: listProject?.length - 1 });
    }
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const storeListProject = await AsyncStorage.getItem('@list_project');
      setListProject(JSON.parse(storeListProject) || []);
    };
    getData();
  }, []);

  useEffect(() => {
    setInputProjectName(routeData?.projectName);
    setInputSerialNo(routeData?.serialNo);
    routeData?.dateProject && setDate(new Date(moment.unix(routeData?.dateProject)));
    setIsEnabled(routeData?.isEncrypted);
  }, [routeData]);

  useEffect(() => {
    navigation.setOptions({
      title: routeData?.screenName,
      headerRight: () =>
        routeData?.screenId === 1 && (
          <TouchableOpacity onPress={handleDeleteProject}>
            <MaterialCommunityIcons name="delete-forever-outline" size={30} color="red" />
          </TouchableOpacity>
        ),
    });
  }, [listProject]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 30 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', paddingTop: 30 }}>
              Engine Serial Number
              <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View
              style={{
                paddingVertical: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextInput
                autoCapitalize="characters"
                value={inputSerialNo}
                onChangeText={setInputSerialNo}
                multiline={true}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                editable={routeData?.screenId === 0}
              />
              {routeData?.projectName ? (
                <View />
              ) : isEnabled ? (
                <TouchableOpacity onPress={handleAuthenticate}>
                  <FontAwesome name="lock" size={24} color="#3f9ae0" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={toggleSwitch}>
                  <FontAwesome name="unlock" size={24} color="grey" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              )}
            </View>
            {isEnabled && (
              <LinearGradient
                colors={['#dcdcdc', '#fff', '#dcdcdc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 10,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: '#000' }}
                >
                  Encrypted : {EncryptedData(inputSerialNo)}
                </Text>
              </LinearGradient>
            )}

            <Text style={{ fontSize: 15, fontWeight: '600', paddingTop: 30 }}>
              Customer Name <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={{ paddingTop: 10, flexDirection: 'row' }}>
              <TextInput
                autoCapitalize={'characters'}
                name="inputProjectName"
                value={inputProjectName}
                onChangeText={setInputProjectName}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                editable={routeData?.screenId === 0}
              />
            </View>

            <Text style={{ fontSize: 15, fontWeight: '600', paddingTop: 30 }}>Date</Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                disabled={routeData?.screenId === 1}
                testID="dateTimePicker"
                value={dateProject}
                mode="date"
                is24Hour={true}
                onChange={onChange}
                display="spinner"
              />
            ) : (
              <TouchableOpacity onPress={handleOpenCalendar}>
                <View
                  style={{
                    padding: 15,
                    marginVertical: 10,
                    borderWidth: 1,
                    borderColor: 'lightgrey',
                    borderRadius: 10,
                  }}
                >
                  <Text>{moment(dateProject).format('DD MMM YYYY')}</Text>
                </View>
                {openCalendar && (
                  <DateTimePicker
                    disabled={routeData?.screenId === 1}
                    testID="dateTimePicker"
                    value={dateProject}
                    mode="date"
                    is24Hour={true}
                    onChange={onChange}
                    display="default"
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

          {routeData?.screenId === 0 && (
            <TouchableOpacity
              style={{
                marginHorizontal: 30,
                marginTop: 30,
                marginBottom: 40,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: !inputProjectName ? 'lightgrey' : '#4cc0ee',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#fff',
              }}
              disabled={!inputProjectName}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '800',
                  textAlign: 'center',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                {`${isEnabled ? 'Encrypt &' : ''} Continue `}
              </Text>
            </TouchableOpacity>
          )}

          {routeData?.screenId === 1 && (
            <TouchableOpacity
              style={{
                marginHorizontal: 30,
                marginTop: 50,
                marginBottom: 40,
                paddingTop: 10,
                paddingBottom: 10,
                borderWidth: 2,
                borderColor: routeData?.isEncrypted && isEnabled ? '#ffc97a' : '#4cc0ee',
                borderRadius: 10,
              }}
              onPress={routeData?.isEncrypted && isEnabled ? handleAuthenticate : handleSubmit}
              underlayColor="#fff"
            >
              <Text
                style={{
                  color: routeData?.isEncrypted && isEnabled ? '#ffc97a' : '#4cc0ee',
                  fontWeight: '800',
                  textAlign: 'center',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                {routeData?.isEncrypted && isEnabled ? 'Decrypt Project' : 'Next'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
