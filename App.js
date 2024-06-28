import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Dashboard from './src/modules/dashboard';
import AddEditTask from './src/modules/addEditTask';
import Home from './src/modules/home';
import AddEditProject from './src/modules/addEditProject';
import ListBlock from './src/modules/ListBlock';
import ListTaskBlock from './src/modules/listTaskBlock';

const Stack = createNativeStackNavigator();

const AuthContext = React.createContext({
  fixtureMode: false,
});

function App() {
  const navigationRef = React.useRef();
  const fixtureMode = false;

  return (
    <AuthContext.Provider value={{ fixtureMode }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen
            name="AddEditTask"
            component={AddEditTask}
            options={{ headerShown: true, title: 'Create New Task' }}
          />

          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen
            name="AddEditProject"
            component={AddEditProject}
            options={{ headerShown: true, title: 'Create New Project' }}
          />
          <Stack.Screen
            name="ListBlock"
            component={ListBlock}
            options={{ headerShown: true, title: 'List Block' }}
          />
          <Stack.Screen
            name="ListTaskBlock"
            component={ListTaskBlock}
            options={{ headerShown: true, title: 'List Task' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
