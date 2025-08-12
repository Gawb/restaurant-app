// AppEntry.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import Onboarding from './app/screen/Onboarding'; // usa tus rutas reales
import Profile from './app/screen/Profile';
import Splash from './app/screen/Splash';

const Stack = createNativeStackNavigator();
const KEY = 'onboardingDone';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem(KEY);
      setDone(flag === '1');
      setLoading(false);
    })();
  }, []);

  if (loading) return <Splash />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {done ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <Onboarding
                {...props}
                onDone={async () => {
                  await AsyncStorage.setItem(KEY, '1');
                  setDone(true);
                }}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
