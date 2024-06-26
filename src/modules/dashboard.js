import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProgressBar, AnimatedFAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import moment from 'moment';
import { arraysEqual } from '../utils.js';

export default function Dashboard() {
  const navigation = useNavigation();

  const [listTask, setListTask] = useState([]);
  const [isExtended, setIsExtended] = useState(true);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const handlePressAddEdit = (item) => () => {
    const payload = {
      ...item,
      screenName: item ? 'View Task' : 'Create Task',
      screenId: item ? 1 : 0,
    };
    navigation.navigate('AddEditTask', payload);
  };

  useFocusEffect(() => {
    const storeData = async () => {
      try {
        const getValue = await AsyncStorage.getItem('@list_task');
        const result = JSON.parse(getValue) || [];
        if (!arraysEqual(listTask, result)) {
          setListTask(result);
        }
      } catch (e) {
        console.error(e);
      }
    };
    storeData();
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView onScroll={onScroll}>
        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 30,
            flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 25, fontWeight: '800', color: '#3f9ae0' }}>PRIOTASK</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            paddingHorizontal: 30,
            paddingVertical: 10,
          }}
        >
          <LinearGradient
            colors={['#4cc0ee', '#1365c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 25 }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 20 }}>
                  {moment().format('DD MMM YYYY')}
                </Text>
                <Text style={{ color: '#ffffff', fontWeight: '800', marginTop: 15 }}>
                  Today's Summary
                </Text>
                <Text style={{ color: '#ffffff', fontWeight: '600', marginTop: 5 }}>
                  {listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                    ?.length > 0 &&
                    listTask?.filter(
                      (a) => a.isDone && moment.unix(a.dateTask).isSame(moment(), 'days')
                    )?.length}
                  {listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                    ?.length > 0 && ' of '}
                  {
                    listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                      ?.length
                  }
                  {listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                    ?.length > 0
                    ? ' Completed'
                    : ' Task'}
                </Text>
              </View>
              <View style={{ position: 'absolute', right: 10, top: -10 }}>
                <Ionicons name="logo-tableau" size={75} color="white" />
              </View>
            </View>
          </LinearGradient>
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 30,
            gap: 10,
          }}
        >
          {listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))?.length >
            0 && (
            <LinearGradient
              colors={['#4cc0ee', '#1365c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                flexGrow: 3,
                gap: 10,
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderRadius: 10,
              }}
            >
              <View
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Progress</Text>
                <Text style={{ color: '#fff', fontWeight: '700' }}>
                  {parseInt(
                    (listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                      ?.length <
                    listTask?.filter(
                      (a) => a.isDone && moment.unix(a.dateTask).isSame(moment(), 'days')
                    )?.length
                      ? 0
                      : listTask?.filter(
                          (a) => a.isDone && moment.unix(a.dateTask).isSame(moment(), 'days')
                        )?.length /
                        listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                          ?.length) * 100
                  )}
                  %
                </Text>
              </View>
              <ProgressBar
                progress={
                  listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                    ?.length <=
                  listTask?.filter(
                    (a) => a.isDone && moment.unix(a.dateTask).isSame(moment(), 'days')
                  )?.length
                    ? 0
                    : listTask?.filter(
                        (a) => a.isDone && moment.unix(a.dateTask).isSame(moment(), 'days')
                      )?.length /
                      listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))
                        ?.length
                }
                color="lightgreen"
              />
            </LinearGradient>
          )}
          {listTask?.filter((a) => !a.isDone && moment.unix(a.dateTask).isBefore(moment(), 'days'))
            ?.length > 0 && (
            <LinearGradient
              colors={['#f36b66', '#f53730']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                borderRadius: 10,
                paddingHorizontal: 20,
                paddingVertical: 10,
                gap: 2,
              }}
            >
              <Text
                style={{ color: '#ffffff', fontWeight: '900', fontSize: 13, textAlign: 'center' }}
              >
                Overdue
              </Text>
              <Text style={{ color: '#ffffff', textAlign: 'center' }}>
                {
                  listTask?.filter(
                    (a) => !a.isDone && moment.unix(a.dateTask).isBefore(moment(), 'days')
                  )?.length
                }{' '}
                Task(s)
              </Text>
            </LinearGradient>
          )}
        </View>

        {listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 30,
              marginTop: 35,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Today's Task(s)</Text>
            </View>
          </View>
        )}

        {listTask?.length > 0 &&
        listTask.filter((a) => !a.isDone && moment.unix(a.dateTask).isSameOrAfter(moment(), 'days'))
          ?.length > 0
          ? listTask
              .filter((a) => !a.isDone && moment.unix(a.dateTask).isSameOrAfter(moment(), 'days'))
              ?.map((a, i) => {
                return (
                  !a.isDone &&
                  moment.unix(a.dateTask).isSameOrAfter(moment(), 'days') &&
                  i < 3 && (
                    <TouchableOpacity onPress={handlePressAddEdit(a)} key={i}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingHorizontal: 30,
                          marginTop: 15,
                        }}
                      >
                        <LinearGradient
                          colors={['#e2eefc', '#fff', '#e2eefc']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            flex: 1,
                            gap: 5,
                            borderRadius: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 15,
                          }}
                        >
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingRight: 25,
                              gap: 5,
                            }}
                          >
                            {a.isEncrypted && (
                              <MaterialCommunityIcons name="key-chain" size={24} color="black" />
                            )}
                            <Text
                              numberOfLines={1}
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: '600',
                                fontSize: 16,
                              }}
                            >
                              {a.taskName}
                            </Text>
                          </View>
                          <Text
                            numberOfLines={2}
                            style={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {a.description}
                          </Text>
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                  )
                );
              })
          : listTask?.filter((a) => moment.unix(a.dateTask).isSame(moment(), 'days'))?.length >
              0 && (
              <View style={{ paddingHorizontal: 30, marginTop: 10 }}>
                <Text>No pending task. Have a great day!</Text>
              </View>
            )}

        {listTask?.length > 0 &&
          listTask?.filter((a) => !a.isDone && moment.unix(a.dateTask).isBefore(moment(), 'days'))
            ?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 30,
                marginTop: 35,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#f36b66' }}>
                  Overdue Task(s)
                </Text>
              </View>
            </View>
          )}

        {listTask?.length > 0 &&
          listTask
            ?.filter((a) => !a.isDone && moment.unix(a.dateTask).isBefore(moment(), 'days'))
            ?.map((a, i) => {
              return (
                i < 3 && (
                  <TouchableOpacity onPress={handlePressAddEdit(a)} key={i}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 30,
                        marginTop: 15,
                      }}
                    >
                      <LinearGradient
                        colors={['#f7cbcb', '#fff', '#f7cbcb']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          flex: 1,
                          gap: 5,
                          borderRadius: 10,
                          paddingHorizontal: 20,
                          paddingVertical: 15,
                        }}
                      >
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingRight: 25,
                            gap: 5,
                          }}
                        >
                          {a.isEncrypted && (
                            <MaterialCommunityIcons name="key-chain" size={24} color="black" />
                          )}
                          <Text
                            numberOfLines={1}
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontWeight: '600',
                              fontSize: 16,
                            }}
                          >
                            {a.taskName}
                          </Text>
                        </View>
                        <Text>{moment.unix(a.dateTask).format('DD MMM YYYY')}</Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {a.description}
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                )
              );
            })}
      </ScrollView>

      <AnimatedFAB
        icon={'plus'}
        label={'Add New Task'}
        extended={isExtended}
        onPress={handlePressAddEdit()}
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
    right: 35,
    position: 'absolute',
  },
});
