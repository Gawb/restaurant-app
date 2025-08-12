// app/screens/Profile.js
import { Button, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'onboardingDone';

export default function Profile({ navigation }) {

const resetOnboarding = async () => {
  await AsyncStorage.removeItem(KEY);
  // si quieres volver inmediatamente:
  //navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
};

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:18, marginBottom:12 }}>Página de perfil</Text>
      <Button title="Reset onboarding (test)" onPress={resetOnboarding} />
    </View>
  );
}
