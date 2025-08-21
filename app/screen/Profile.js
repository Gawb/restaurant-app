// app/screen/Profile.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { MaskedTextInput } from "react-native-mask-text";
import { UserContext } from '../context/UserContext'; // IMPORTA EL CONTEXTO

const USER_KEY = "first-user-data";
const STORAGE_KEY = "email-notifications:v1";

const OPTIONS = [
  { id: "orderStatuses", label: "Order statuses" },
  { id: "passwordChanges", label: "Password changes" },
  { id: "specialOffers", label: "Special offers" },
  { id: "newsletter", label: "Newsletter" },
];

const DEFAULT_CHECKS = {
  orderStatuses: true,
  passwordChanges: true,
  specialOffers: true,
  newsletter: true,
};

export default function Profile({ onLogout }) {
  const { setUser } = useContext(UserContext); // 👈 para refrescar el header

  const [checks, setChecks] = useState(DEFAULT_CHECKS);
  const [hydrated, setHydrated] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUri: '',
  });

  const resetOnboarding = async () => {
    //await AsyncStorage.removeItem(USER_KEY);
    await onLogout?.();
  };

  // Cargar preferencias al montar
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setChecks(s => ({ ...s, ...JSON.parse(raw) }));
        }
      } catch (e) {
        console.warn("No se pudo cargar preferencias:", e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Cargar datos de usuario al montar
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(USER_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          setUserData(s => ({ ...s, ...parsed, avatarUri: parsed.avatarUri ?? '' }));
        }
      } catch (e) {
        console.log('No se cargó user Data: ', e);
      }
    })();
  }, []);

  // Guardar cambios de inputs
  const saveChanges = async () => {
    try {
      const payload = {
        ...userData,
        name: userData.name.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim(),
        phone: userData.phone.trim(),
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(payload));
      setUser(payload); // 👈 actualiza header en vivo
      console.log('guardado info user correctamente');
    } catch (e) {
      console.log('error al guardar info-user: ', e);
    }
  };

  // Guardar preferencias cuando cambien
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checks))
      .catch((e) => console.warn("No se pudo guardar preferencias:", e));
  }, [checks, hydrated]);

  const toggle = useCallback((id) => {
    setChecks((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  const CheckboxSection = () => (
    OPTIONS.map((opt) => {
      const checked = !!checks[opt.id];
      return (
        <Pressable
          key={opt.id}
          onPress={() => toggle(opt.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={opt.label}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingVertical: 6,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Checkbox value={checked} color={checked ? "#495E57" : undefined} />
          <Text style={profileStyles.checkBoxText}>{opt.label}</Text>
        </Pressable>
      );
    })
  );

  // Avatar: cambiar / eliminar
  const MEDIA_IMAGES =
    ImagePicker.MediaType?.Images ?? ImagePicker.MediaTypeOptions.Images;

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Necesito permiso para acceder a tus fotos 🙂');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MEDIA_IMAGES,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    const payload = { ...userData, avatarUri: uri };
    setUserData(payload);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(payload));
    setUser(payload); // 👈 actualiza header en vivo
  };

  const handleRemoveAvatar = async () => {
    const payload = { ...userData, avatarUri: '' };
    setUserData(payload);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(payload));
    setUser(payload); // 👈 actualiza header en vivo
    console.log('img eliminada');
  };

  // Utilidad para iniciales
  const getInitials = () => {
    const a = (userData.name || "").trim().slice(0, 1).toUpperCase();
    const b = (userData.lastName || "").trim().slice(0, 1).toUpperCase();
    return `${a}${b}` || "?";
  };

  const GetIconAvatar = () => {
    if (userData.avatarUri) {
      return (
        <Image
          source={{ uri: userData.avatarUri }}
          style={profileStyles.profileImg}
        />
      );
    }
    return (
      <Text style={profileStyles.iconText}>
        {getInitials()}
      </Text>
    );
  };

  return (
    <ScrollView>
      <Text style={profileStyles.titleText}>Personal Information</Text>
      <Text style={profileStyles.sectionText}>Avatar</Text>
      <View style={profileStyles.avatarContain}>
        <View style={profileStyles.imgContain}>
          <GetIconAvatar />
        </View>
        <Pressable onPress={handleChangeAvatar} style={[profileStyles.greenButton, profileStyles.avatarButon]}>
          <Text style={profileStyles.greenButtonText}>Change</Text>
        </Pressable>
        <Pressable onPress={handleRemoveAvatar} style={[profileStyles.whiteButton, profileStyles.avatarButon]}>
          <Text style={profileStyles.whiteButtonText}>Remove</Text>
        </Pressable>
      </View>

      <Text style={profileStyles.sectionText}>First name</Text>
      <TextInput
        style={profileStyles.input}
        value={userData.name}
        onChangeText={(t) => setUserData(s => ({ ...s, name: t }))}
      />

      <Text style={profileStyles.sectionText}>Last name</Text>
      <TextInput
        value={userData.lastName}
        style={profileStyles.input}
        onChangeText={(t) => setUserData(s => ({ ...s, lastName: t }))}
      />

      <Text style={profileStyles.sectionText}>Email</Text>
      <TextInput
        value={userData.email}
        onChangeText={(t) => setUserData(s => ({ ...s, email: t }))}
        style={profileStyles.input}
        placeholder="you@example.com"
        placeholderTextColor="#6B7280"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
      />

      <Text style={profileStyles.sectionText}>Phone number</Text>
      <MaskedTextInput
        mask="+56 9 9999 9999"
        value={userData.phone}
        onChangeText={(t, rt) => setUserData(s => ({ ...s, phone: rt }))}
        style={profileStyles.input}
        placeholder="912321232"
        placeholderTextColor="#6B7280"
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
      />

      <View style={profileStyles.checkBoxContainer}>
        <Text style={profileStyles.titleTextCheckBox}>Email notifications</Text>
        <CheckboxSection />
      </View>

      <Pressable style={profileStyles.yellowButton} onPress={resetOnboarding}>
        <Text style={profileStyles.yellowButtonText}>Log out</Text>
      </Pressable>

      <View style={profileStyles.buttonsContainer}>
        <Pressable style={[profileStyles.whiteButton, profileStyles.changesButon]}>
          <Text style={profileStyles.whiteButtonText}>Discard changes</Text>
        </Pressable>
        <Pressable onPress={saveChanges} style={[profileStyles.greenButton, profileStyles.changesButon]}>
          <Text style={profileStyles.greenButtonText}>Save changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const profileStyles = StyleSheet.create({
  avatarContain: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 6,
    marginBottom: 14,
  },
  imgContain: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 40,
    marginHorizontal: 10,
    backgroundColor: '#08eedbff'
  },
  profileImg: {
    resizeMode: 'contain',
    height: 100,
    width: 100,
  },
  iconText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 26,
  },
  avatarButon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: 100,
    borderRadius: 10,
    marginVertical: 12,
    marginHorizontal: 10,
  },
  greenButton: {
    backgroundColor: '#1F2937',
  },
  greenButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  whiteButton: {
    borderColor: '#1F2937',
    borderWidth: 1,
  },
  whiteButtonText: {
    color: '#1F2937',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    margin: 10,
  },
  sectionText: {
    color: 'grey',
    marginLeft: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b8b8b8ff',
    borderRadius: 6,
    marginHorizontal: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  checkBoxContainer: {
    padding: 16,
    gap: 12,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
    titleTextCheckBox: {
    fontSize: 18,
    fontWeight: "700",
    margin: 4
  },
  checkBoxText: {
    fontSize: 15,
  },
  yellowButton: {
    backgroundColor: '#F4CE14',
    borderColor: '#e0ac00ff',
    borderWidth: 2,
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginVertical: 14,
  },
  yellowButtonText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  changesButon: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    margin: 12
  }
});
