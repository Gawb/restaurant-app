import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const Onboarding =  ({navigation, onDone}) => {
  const [email, onChangeEmail] = useState("");
  const [name, onChangeName] = useState("");
  const isValid = name.trim().length > 0 && /\S+@\S+\.\S+/.test(email);

  const handleNext = async () => {
    // 1) marca el onboarding como completado (lo hace el padre)
    await onDone?.();
    // 2) navega a Profile reemplazando la pantalla actual
    //navigation.replace('Profile');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.root}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* BODY (scrollable si el teclado tapa) */}
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Let us get to know you</Text>

          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={onChangeName}
              placeholder="Your first name"
              placeholderTextColor="#6B7280"
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={onChangeEmail}
              placeholder="you@example.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
        </ScrollView>

        {/* FOOTER (botón a la derecha) */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleNext}
            disabled={!isValid}
            style={[styles.cta, !isValid && styles.ctaDisabled]}
          >
            <Text style={styles.ctaText}>Next</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Onboarding;

const styles = StyleSheet.create({
  // layout base
  root: { flex: 1, 
    backgroundColor: "#E9EEF2" 
}, 
  header: {
    height: 100,
    backgroundColor: "#DEE5EB",
    justifyContent: "center",
  },
  logo: {
    height: 100,
    width: 300,
    resizeMode: "contain",
    alignSelf: "center",
  },
  // body
  body: {
    flexGrow: 1,
    backgroundColor: "#C9D3DB", 
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 60,
    alignItems: "center",
    justifyContent: "space-between",

  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 40,
  },
  form: {
    width: "100%",
    maxWidth: 360, // limitar ancho para que se vea bien en tablets
    gap: 6,
  },
  label: {
    color: "#1F2937",
        fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    marginTop: 6,
    borderWidth: 2,
    borderColor: "#23424A",
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 18,
  },

  // footer
  footer: {
    height: 140,
    backgroundColor: "#E9EEF2",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D7DEE6",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,

  },
  cta: {
    minWidth: 110,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9FB3C8", // deshabilitado por defecto en mock
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
});
