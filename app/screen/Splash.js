// app/screens/Splash.js
import { ActivityIndicator, View } from 'react-native';
export default function Splash() {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
