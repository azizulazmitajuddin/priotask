import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DecryptedData, EncryptedData } from '../utils.js/index.js';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function AddEditTask({ route }) {
  const navigation = useNavigation();
  const routeData = route?.params;

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const [inputTaskName, setInputTaskName] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const [listTask, setListTask] = useState([]);

  // function for switch encryption
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // function for decrypt data
  const handleUnlock = () => {
    setIsEnabled(false);
    setInputTaskName(DecryptedData(inputTaskName));
    setInputDescription(DecryptedData(inputDescription));
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

  // handle delete task
  const handleDeleteTask = useCallback(async () => {
    const final = listTask.filter((a) => a.taskName !== routeData.taskName);
    await AsyncStorage.setItem('@list_task', JSON.stringify(final));
    navigation.navigate('Dashboard');
  }, [routeData, listTask]);

  // handle create and completing task
  const handleSubmit = async () => {
    try {
      const payload = {
        taskName: isEnabled ? EncryptedData(inputTaskName) : inputTaskName,
        description: isEnabled ? EncryptedData(inputDescription) : inputDescription,
        dateCreated: moment().unix(),
        isEncrypted: routeData?.isEncrypted ? !Boolean(isEnabled) : Boolean(isEnabled),
        isDone: routeData?.screenId === 1,
      };

      if (routeData?.screenId === 1) {
        const temp = listTask?.map((a) => {
          if (a.taskName === routeData.taskName) {
            return {
              ...a,
              isDone: a.taskName === routeData.taskName,
            };
          } else {
            return a;
          }
        });
        await AsyncStorage.setItem('@list_task', JSON.stringify(temp));
      }

      if (routeData?.screenId === 0) {
        listTask.push(payload);
        if (inputTaskName) {
          await AsyncStorage.setItem('@list_task', JSON.stringify(listTask));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      navigation.navigate('Dashboard');
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
      const storeListTask = await AsyncStorage.getItem('@list_task');
      setListTask(JSON.parse(storeListTask) || []);
    };
    getData();
  }, []);

  useEffect(() => {
    setInputTaskName(routeData?.taskName);
    setInputDescription(routeData?.description);
    setIsEnabled(routeData?.isEncrypted);
  }, [routeData]);

  useEffect(() => {
    navigation.setOptions({
      title: routeData?.screenName,
      headerRight: () =>
        routeData?.screenId === 1 && (
          <TouchableOpacity onPress={handleDeleteTask}>
            <MaterialCommunityIcons name="delete-forever-outline" size={30} color="red" />
          </TouchableOpacity>
        ),
    });
  }, [listTask]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View
            style={{
              paddingHorizontal: 30,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', paddingTop: 30 }}>
              Task Name <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={{ paddingTop: 10, flexDirection: 'row' }}>
              <TextInput
                name="inputTaskName"
                value={inputTaskName}
                onChangeText={setInputTaskName}
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

            <Text style={{ fontSize: 15, fontWeight: '600', paddingTop: 30 }}>Description</Text>
            <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
              <TextInput
                value={inputDescription}
                onChangeText={setInputDescription}
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
            </View>

            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexGrow: 1,
                flexDirection: 'row',
                gap: 5,
                marginTop: 15,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600' }}>Encrypted</Text>
              <Switch
                trackColor={{ false: '#8b9295', true: '#4cc0ee' }}
                ios_backgroundColor="#8b9295"
                onValueChange={toggleSwitch}
                value={isEnabled}
                disabled={routeData?.screenId === 1}
              />
            </View>
          </View>

          {routeData?.screenId === 0 && (
            <TouchableOpacity
              style={{
                marginHorizontal: 30,
                marginTop: 30,
                marginBottom: 40,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: !inputTaskName ? 'lightgrey' : '#4cc0ee',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#fff',
              }}
              disabled={!inputTaskName}
              onPress={handleSubmit}
              underlayColor="#fff"
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
                Create Task
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
                {routeData?.isEncrypted && isEnabled ? 'Decrypt Task' : 'Complete Task'}
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
