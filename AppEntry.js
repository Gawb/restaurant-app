// AppEntry.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createContext, useContext, useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import Onboarding from './app/screen/Onboarding';
import Profile from './app/screen/Profile';
import Splash from './app/screen/Splash';

const Stack = createNativeStackNavigator();
const KEY = 'onboardingDone';
const USER_KEY = 'first-user-data';

// 👇 Context global de usuario
export const UserContext = createContext({
  user: { name: '', lastName: '', email: '', phone: '', avatarUri: '' },
  setUser: (_u) => {},
});

const DEFAULT_USER = { name: '', lastName: '', email: '', phone: '', avatarUri: '' };


// Header avatar ahora lee del Context (no de AsyncStorage directo)
function HeaderAvatar() {
  const { user } = useContext(UserContext);

  const getInitials = () => {
    const a = (user.name || '').trim().slice(0, 1).toUpperCase();
    const b = (user.lastName || '').trim().slice(0, 1).toUpperCase();
    return (a + b) || '?';
  };

  return (
    <Pressable style={{ paddingHorizontal: 8 }} hitSlop={8} accessibilityLabel="Abrir perfil">
      {user.avatarUri ? (
        <Image source={{ uri: user.avatarUri }} style={{ width: 32, height: 32, borderRadius: 16 }} />
      ) : (
        <View style={{
          width: 32, height: 32, borderRadius: 16, backgroundColor: '#1F2937',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>{getInitials()}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  // 👇 estado global de usuario en App
  const [user, setUser] = useState({ name: '', lastName: '', email: '', phone: '', avatarUri: '' });

  // hidrata "onboarding" y usuario
  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem(KEY);
      setDone(flag === '1');
      try {
        const raw = await AsyncStorage.getItem(USER_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <Splash />;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Image source={require('./assets/images/logo.png')}
                     style={{ width: 120, height: 40, resizeMode: 'contain' }} />
            ),
            headerRight: () => <HeaderAvatar />,
          }}
        >
          {!done ? (
            <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
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
          ) : (
            <Stack.Screen name="Profile">
              {(props) => (
                <Profile
                  {...props}
                  onLogout={async () => {
                    await AsyncStorage.multiRemove([KEY, USER_KEY]);
                    setUser(DEFAULT_USER);  
                    setDone(false);
                  }}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
