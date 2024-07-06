import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

import React, { useCallback, useState, useEffect } from 'react';

export default function ListTaskBlock({ route }) {
  const routeData = route?.params;

  const [isExtended, setIsExtended] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputTaskName, setInputTaskName] = useState('');

  const [listProject, setListProject] = useState([]);
  const [listTask, setListTask] = useState([]);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const handlePressAddEdit = (item) => async () => {
    const arr = listTask?.map((a, i) =>
      a.taskId === item.taskId ? { ...a, isSuccess: !a.isSuccess } : a
    );
    setListTask(arr);

    const result = listProject?.map((a, i) => {
      if (i === routeData?.projectId) {
        const temp = a.listBlock.map((b) => {
          if (b.blockId == routeData?.listId) {
            return {
              ...b,
              listTask: arr,
            };
          } else {
            return b;
          }
        });

        return { ...a, listBlock: [...temp] };
      }

      return a;
    });

    const final = listProject?.map((a, i) => {
      if (i === routeData?.projectId) {
        return {
          ...a,
          isDone:
            result?.[routeData?.projectId]?.listBlock?.filter(
              (a) => a.listTask?.filter((b) => !b?.isSuccess)?.length
            )?.length == 0,
        };
      }

      return a;
    });

    await AsyncStorage.setItem('@list_project', JSON.stringify(final));

    setListProject(final);
  };

  const handleOpenClose = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible]);

  const handleSubmit = useCallback(async () => {
    const arr = [...listTask, ...[{ taskId: listTask?.length, taskName: inputTaskName }]];

    let final = listProject?.map((a, i) => {
      if (i === routeData?.projectId) {
        const temp = a.listBlock.map((b) => {
          if (b.blockId == routeData?.listId) {
            return {
              ...b,
              listTask: arr,
            };
          } else {
            return b;
          }
        });

        return { ...a, listBlock: [...temp] };
      }
      return a;
    });

    await AsyncStorage.setItem('@list_project', JSON.stringify(final));

    setListProject(final);
    setListTask(arr);
    setInputTaskName('');

    handleOpenClose();
  }, [modalVisible, listTask, inputTaskName, listProject]);

  useEffect(() => {
    const getData = async () => {
      const storeListProject = await AsyncStorage.getItem('@list_project');
      setListProject(JSON.parse(storeListProject) || []);
      setListTask(
        JSON.parse(storeListProject)?.[routeData?.projectId]?.listBlock?.filter(
          (a) => a.blockId == routeData?.listId
        )[0]?.listTask || []
      );
    };
    getData();
  }, [routeData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView onScroll={onScroll}>
        <View style={{ marginTop: 20, paddingHorizontal: 30, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#3f9ae0' }}>
              Task Block {routeData?.listId}
            </Text>
          </View>
        </View>

        {listTask?.map((a, i) => {
          return (
            <View
              key={i}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'lightgrey',
                marginTop: 20,
                marginHorizontal: 30,
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: a.isSuccess ? 'lightgreen' : '#fff',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text>
                {a.taskId + 1}. {a?.taskName}
              </Text>
              <TouchableOpacity onPress={handlePressAddEdit(a)}>
                <Text>
                  {a.isSuccess ? (
                    <Feather name="x" size={24} color="black" />
                  ) : (
                    <MaterialIcons name="done-outline" size={24} color="black" />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleOpenClose}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ minWidth: '90%' }}>
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
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 50 }}>
                <Pressable
                  style={[
                    {
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      marginTop: 30,
                      marginTop: 50,
                    },
                  ]}
                  onPress={handleOpenClose}
                >
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose, { marginTop: 50 }]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.textStyle}>Add New Task</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <AnimatedFAB
        icon={'plus'}
        label={'Add New Task'}
        extended={isExtended}
        onPress={handleOpenClose}
        visible={true}
        color="#fff"
        style={[styles.fabStyle, { backgroundColor: '#4cc0ee', fontWeight: '900' }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  fabStyle: {
    bottom: 35,
    right: '30%',
    position: 'absolute',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
