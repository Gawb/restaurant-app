// index.js  (en la raíz)
import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler'; // 1) antes de todo (RN Navigation)
import App from './AppEntry'; // 2) NOMBRE QUE EXISTA (no chocar con carpeta "app/")
registerRootComponent(App);
