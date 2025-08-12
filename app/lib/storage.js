// app/lib/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'onboardingDone';

export const setOnboardingDone = async () => AsyncStorage.setItem(KEY, '1');
export const getOnboardingDone = async () => AsyncStorage.getItem(KEY);
export const clearOnboarding = async () => AsyncStorage.removeItem(KEY); // para pruebas
