import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useState, useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function ListBlock({ route }) {
  const navigation = useNavigation();
  const routeData = route?.params;
  const isFocused = useIsFocused();

  const [listProject, setListProject] = useState([]);

  const checkItem = (index, type) => {
    const isSuccess =
      listProject?.[routeData?.projectId]?.listBlock?.filter((a) => a.blockId == index)?.[0]
        ?.listTask?.length > 0 &&
      listProject?.[routeData?.projectId]?.listBlock?.filter((a) => a.blockId == index)?.[0]
        ?.listTask?.length ==
        listProject?.[routeData?.projectId]?.listBlock
          ?.filter((a) => a.blockId == index)?.[0]
          ?.listTask?.filter((a) => a.isSuccess)?.length;
    const inProgress =
      listProject?.[routeData?.projectId]?.listBlock?.filter((a) => a.blockId == index)?.[0]
        ?.listTask?.length > 0;
    if (type == 0) {
      return isSuccess ? 'lightgreen' : inProgress ? '#ffe244' : '#fff';
    }
    if (type == 1) {
      return isSuccess || inProgress ? 0 : 1;
    }
  };

  const handleNavigate = useCallback(
    (index) => async () => {
      const final = listProject?.map((a, i) => {
        if (i === routeData?.projectId) {
          if (a?.listBlock?.length > 0) {
            const temp = a.listBlock?.filter((b) => {
              return b.blockId !== index;
            });

            const found =
              a.listBlock?.filter((b) => {
                return b.blockId == index;
              })?.length > 0;

            if (!found) {
              temp.push({ ...a?.listTask, blockId: index });
              return { ...a, listBlock: [...temp] };
            } else {
              return a;
            }
          } else {
            return {
              ...a,
              listBlock: [
                {
                  ...a?.listTask,
                  blockId: index,
                },
              ],
            };
          }
        } else {
          return a;
        }
      });
      setListProject(final);
      await AsyncStorage.setItem('@list_project', JSON.stringify(final));

      navigation.navigate('ListTaskBlock', { ...routeData, listId: index });
    },
    [listProject]
  );

  useEffect(() => {
    const getData = async () => {
      const storeListProject = await AsyncStorage.getItem('@list_project');
      setListProject(JSON.parse(storeListProject) || []);
    };
    getData();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {[1, 2, 3, 4, 5, 6, 7].map((a, i) => {
            return (
              <TouchableOpacity onPress={handleNavigate(a)} key={i}>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                      gap: 2,
                      backgroundColor: checkItem(a, 0),
                      borderWidth: checkItem(a, 1),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontWeight: '700' }}>Block {a}</Text>
                    {listProject?.[routeData?.projectId]?.listBlock?.filter(
                      (b) => b.blockId == a
                    )?.[0]?.listTask?.length > 0 && (
                      <Text style={{ fontWeight: '700' }}>
                        {
                          listProject?.[routeData?.projectId]?.listBlock
                            ?.filter((b) => b.blockId == a)?.[0]
                            ?.listTask?.filter((b) => b.isSuccess)?.length
                        }{' '}
                        /{' '}
                        {
                          listProject?.[routeData?.projectId]?.listBlock?.filter(
                            (b) => b.blockId == a
                          )?.[0]?.listTask?.length
                        }
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});
