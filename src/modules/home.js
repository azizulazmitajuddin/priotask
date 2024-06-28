import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar, AnimatedFAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';
import { arraysEqual } from '../utils.js';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Home() {
  const navigation = useNavigation();

  const [listProject, setListProject] = useState([]);
  const [isExtended, setIsExtended] = useState(true);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const handlePressAddEdit = (item) => () => {
    const payload = {
      ...item,
      screenName: item ? 'View Project' : 'Create Project',
      screenId: item ? 1 : 0,
    };
    navigation.navigate('AddEditProject', payload);
  };

  useFocusEffect(() => {
    const storeData = async () => {
      try {
        const getValue = await AsyncStorage.getItem('@list_project');
        const result = JSON.parse(getValue) || [];
        if (!arraysEqual(listProject, result)) {
          setListProject(result);
        }
      } catch (e) {
        console.error(e);
      }
    };
    storeData();
    // AsyncStorage.clear();
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView onScroll={onScroll}>
        <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 30 }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 30,
              paddingVertical: 25,
              overflow: 'hidden',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  position: 'absolute',
                  top: -15,
                  left: Platform.OS === 'ios' ? SCREEN_WIDTH / 9.8 : SCREEN_WIDTH / 10.8,
                }}
              >
                <Entypo name="paper-plane" size={74} color="#c6edf8" />
              </View>
              <Text style={{ fontSize: 35, fontWeight: '800', color: '#184387' }}>ProEngine</Text>
            </View>

            <Image
              style={{ position: 'absolute', top: -35, left: -130, zIndex: -1, opacity: 0.6 }}
              width={10}
              source={require('../../assets/engine.jpeg')}
            />
            <View
              style={{
                marginTop: 30,
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text
                  style={{
                    color: '#11408d',
                    fontWeight: '900',
                    marginTop: 10,
                    fontSize: 15,
                    backgroundColor: '#cecece',
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                  }}
                >
                  {moment().format('DD MMM YYYY')}
                </Text>
                <Text
                  style={{
                    color: '#11408d',
                    fontWeight: '800',
                    marginTop: 10,
                    backgroundColor: '#cecece',
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                  }}
                >
                  Today's Summary
                </Text>
                <Text
                  style={{
                    color: '#11408d',
                    fontWeight: '700',
                    backgroundColor: '#cecece',
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                  }}
                >
                  {listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))
                    ?.length > 0 &&
                    listProject?.filter(
                      (a) => a.isDone && moment.unix(a.dateProject).isSame(moment(), 'days')
                    )?.length}
                  {listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))
                    ?.length > 0 && ' of '}
                  {
                    listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))
                      ?.length
                  }
                  {listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))
                    ?.length > 0
                    ? ' Completed'
                    : ' Project'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 25,
            flexDirection: 'row',
            paddingHorizontal: 30,
            gap: 10,
          }}
        >
          {listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))?.length >
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
                    (listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))
                      ?.length <
                    listProject?.filter(
                      (a) => a.isDone && moment.unix(a.dateProject).isSame(moment(), 'days')
                    )?.length
                      ? 0
                      : listProject?.filter(
                          (a) => a.isDone && moment.unix(a.dateProject).isSame(moment(), 'days')
                        )?.length /
                        listProject?.filter((a) =>
                          moment.unix(a.dateProject).isSame(moment(), 'days')
                        )?.length) * 100
                  )}
                  %
                </Text>
              </View>
              <ProgressBar
                progress={
                  listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))
                    ?.length <=
                  listProject?.filter(
                    (a) => a.isDone && moment.unix(a.dateProject).isSame(moment(), 'days')
                  )?.length
                    ? 0
                    : listProject?.filter(
                        (a) => a.isDone && moment.unix(a.dateProject).isSame(moment(), 'days')
                      )?.length /
                      listProject?.filter((a) =>
                        moment.unix(a.dateProject).isSame(moment(), 'days')
                      )?.length
                }
                color="lightgreen"
              />
            </LinearGradient>
          )}
          {listProject?.filter(
            (a) => !a.isDone && moment.unix(a.dateProject).isBefore(moment(), 'days')
          )?.length > 0 && (
            <LinearGradient
              colors={['#f36b66', '#f53730']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                borderRadius: 10,
                paddingHorizontal: 20,
                paddingVertical: 10,
                gap: 4,
              }}
            >
              <Text
                style={{ color: '#ffffff', fontWeight: '900', fontSize: 13, textAlign: 'center' }}
              >
                Overdue
              </Text>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '700' }}>
                {
                  listProject?.filter(
                    (a) => !a.isDone && moment.unix(a.dateProject).isBefore(moment(), 'days')
                  )?.length
                }
              </Text>
            </LinearGradient>
          )}
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{ marginTop: 20, borderWidth: 2, width: 100, borderColor: 'lightgrey' }}
          ></View>
        </View>

        {listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))?.length >
          0 && (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 30,
              marginTop: 35,
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
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Today's Project(s)</Text>
            </View>
          </View>
        )}

        {listProject?.length > 0 &&
        listProject.filter(
          (a) => !a.isDone && moment.unix(a.dateProject).isSameOrAfter(moment(), 'days')
        )?.length > 0
          ? listProject
              .filter(
                (a) => !a.isDone && moment.unix(a.dateProject).isSameOrAfter(moment(), 'days')
              )
              ?.map((a, i) => {
                return (
                  !a.isDone &&
                  moment.unix(a.dateProject).isSameOrAfter(moment(), 'days') &&
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
                              {a.projectName}
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
                            {a.serialNo}
                          </Text>
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                  )
                );
              })
          : listProject?.filter((a) => moment.unix(a.dateProject).isSame(moment(), 'days'))
              ?.length > 0 && (
              <View style={{ paddingHorizontal: 30, marginTop: 10 }}>
                <Text>No pending project. Have a great day!</Text>
              </View>
            )}

        {listProject?.length > 0 &&
          listProject?.filter(
            (a) => !a.isDone && moment.unix(a.dateProject).isBefore(moment(), 'days')
          )?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 30,
                marginTop: 35,
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
                  Overdue Project(s)
                </Text>
              </View>
            </View>
          )}

        {listProject?.length > 0 &&
          listProject
            ?.filter((a) => !a.isDone && moment.unix(a.dateProject).isBefore(moment(), 'days'))
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
                            {a.projectName}
                          </Text>
                        </View>
                        <Text>{moment.unix(a.dateProject).format('DD MMM YYYY')}</Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {a.serialNo}
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
        label={'Add New Project'}
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
