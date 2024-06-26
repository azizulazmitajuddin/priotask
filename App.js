import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Dashboard from './src/modules/dashboard';
import AddEditTask from './src/modules/AddEditTask';

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
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen
            name="AddEditTask"
            component={AddEditTask}
            options={{ headerShown: true, title: 'Create New Task' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
