import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, ScrollView, Share, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import { GradientBackground } from "../../components/GradientBackground";
import { PremiumButton } from "../../components/PremiumButton";
import { Typography } from "../../components/Typography";
import { BorderRadius, Colors, Spacing } from "../../core/theme";

const BACKGROUND_OPTIONS = [
  { id: "dopamine", name: "Dopamine", colors: ["rgba(238, 95, 43, 0.2)", "#fff", "rgba(238, 95, 43, 0.1)"] },
  { id: "grainy", name: "Grainy", colors: ["#f5f5f5", "#e0e0e0", "#d6d6d6"] },
  { id: "cloudy", name: "Cloudy", colors: ["#e0f2fe", "#bae6fd", "#7dd3fc"] },
  { id: "pastel", name: "Pastel", colors: ["#fecdd3", "#fda4af", "#fb7185"] },
  { id: "silk", name: "Silk", colors: ["#e0e7ff", "#c7d2fe", "#a5b4fc"] },
];

const FONT_OPTIONS = [
  { id: "jakarta", name: "Jakarta Sans", variant: "display" as const },
  { id: "serif", name: "Modern Serif", variant: "serif" as const },
];

export default function CustomizerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const previewRef = useRef<View>(null);

  const [userName, setUserName] = useState("Alex Chen");
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_OPTIONS[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);

  const captureImage = async () => {
    try {
      const uri = await captureRef(previewRef, {
        format: "png",
        quality: 1,
      });
      return uri;
    } catch (e) {
      console.error("Capture failed:", e);
      Alert.alert("Error", "No se pudo capturar la imagen");
      return null;
    }
  };

  const handleShare = async () => {
    const uri = await captureImage();
    if (!uri) return;

    try {
      await Share.share({
        url: uri,
        message: "Check out my quote from Shine On! ✨",
      });
    } catch (e) {
      console.error("Share failed:", e);
      Alert.alert("Error", "No se pudo compartir la imagen");
    }
  };

  const handleSave = async () => {
    const uri = await captureImage();
    if (!uri) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos permiso para guardar la imagen");
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("Shine On");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album);
      } else {
        await MediaLibrary.createAlbumAsync("Shine On", asset);
      }

      Alert.alert("Éxito", "Imagen guardada en tu galería!");
    } catch (e) {
      console.error("Save failed:", e);
      Alert.alert("Error", "No se pudo guardar la imagen");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Typography size="lg" weight="bold">
            Make it Yours
          </Typography>
          <View style={styles.headerButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.previewSection}>
            <View style={styles.previewWrapper}>
              <GradientBackground colors={selectedBg.colors} style={styles.preview}>
                <View style={styles.previewTop}>
                  <MaterialIcons name="auto-awesome" size={20} color={Colors.primary} />
                  <Typography
                    size="xs"
                    weight="bold"
                    color="rgba(15, 23, 42, 0.6)"
                    style={styles.previewLogoText}
                  >
                    Shine On
                  </Typography>
                </View>

                <View style={styles.previewContent}>
                  <MaterialIcons
                    name="format-quote"
                    size={40}
                    color={Colors.primary}
                    style={styles.quoteIcon}
                  />
                  <Typography
                    variant={selectedFont.variant}
                    size="3xl"
                    weight={selectedFont.variant === "display" ? "bold" : undefined}
                    italic={selectedFont.variant === "serif"}
                    style={styles.previewText}
                  >
                    {params.text || "The best way to predict the future is to create it."}
                  </Typography>
                  <View style={styles.previewDivider} />
                  <Typography size="lg" weight="medium" color={Colors.primary}>
                    — {params.author || "Peter Drucker"}
                  </Typography>
                </View>

                <View style={styles.previewBottom}>
                  <Typography size="xs" weight="medium" color={Colors.slate[500]}>
                    shared by{" "}
                    <Typography size="xs" weight="medium" color={Colors.primary}>
                      {userName}
                    </Typography>
                  </Typography>
                </View>
              </GradientBackground>
            </View>
            <Typography size="sm" weight="medium" color={Colors.slate[500]} style={styles.previewLabel}>
              9:16 Preview for Stories
            </Typography>
          </View>

          <View style={styles.controls}>
            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Personalize
              </Typography>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person" size={24} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Add your name"
                  placeholderTextColor={Colors.slate[400]}
                />
              </View>
            </View>

            <View style={styles.controlSection}>
              <View style={styles.sectionHeader}>
                <Typography size="base" weight="bold">
                  Background Style
                </Typography>
                <Typography size="sm" weight="medium" color={Colors.primary}>
                  See All
                </Typography>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsRow}
              >
                {BACKGROUND_OPTIONS.map((bg) => (
                  <TouchableOpacity key={bg.id} style={styles.optionItem} onPress={() => setSelectedBg(bg)}>
                    <GradientBackground
                      colors={bg.colors}
                      style={[styles.optionCircle, selectedBg.id === bg.id && styles.optionCircleActive]}
                    />
                    <Typography
                      size="xs"
                      weight={selectedBg.id === bg.id ? "bold" : "medium"}
                      color={selectedBg.id === bg.id ? Colors.slate[900] : Colors.slate[500]}
                    >
                      {bg.name}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Typography
              </Typography>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsRow}
              >
                {FONT_OPTIONS.map((font) => (
                  <TouchableOpacity
                    key={font.id}
                    style={[styles.fontButton, selectedFont.id === font.id && styles.fontButtonActive]}
                    onPress={() => setSelectedFont(font)}
                  >
                    <Typography
                      size="sm"
                      weight={selectedFont.id === font.id ? "bold" : "medium"}
                      color={selectedFont.id === font.id ? "#fff" : Colors.slate[900]}
                    >
                      {font.name}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSave}>
              <MaterialIcons name="save-alt" size={20} color={Colors.primary} />
              <Typography size="sm" weight="bold" color={Colors.primary}>
                Guardar
              </Typography>
            </TouchableOpacity>
            <PremiumButton title="Compartir" onPress={handleShare} style={styles.primaryButton} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(238, 95, 43, 0.1)",
    backgroundColor: "rgba(248, 246, 246, 0.8)",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: Spacing.md,
  },
  previewSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  previewWrapper: {
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
  preview: {
    aspectRatio: 9 / 16,
    borderRadius: BorderRadius.default,
    padding: Spacing.xl,
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewTop: {
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "center",
    opacity: 0.6,
  },
  previewLogoText: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  previewContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  quoteIcon: {
    opacity: 0.4,
    marginBottom: Spacing.md,
  },
  previewText: {
    textAlign: "center",
    lineHeight: 40,
  },
  previewDivider: {
    width: 48,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginVertical: Spacing.lg,
  },
  previewBottom: {
    //
  },
  previewLabel: {
    marginTop: Spacing.md,
  },
  controls: {
    gap: Spacing.xl,
  },
  controlSection: {
    gap: Spacing.md,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: Spacing.md,
    top: 18,
    zIndex: 1,
    opacity: 0.6,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "rgba(238, 95, 43, 0.1)",
    borderRadius: BorderRadius.default,
    paddingLeft: 56,
    paddingRight: Spacing.md,
    fontSize: 16,
    color: Colors.slate[900],
  },
  optionsRow: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  optionItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  optionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCircleActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fontButton: {
    paddingHorizontal: Spacing.lg,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(238, 95, 43, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(238, 95, 43, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  fontButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.background.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  secondaryButton: {
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(238, 95, 43, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(238, 95, 43, 0.2)",
  },
  primaryButton: {
    flex: 1,
  },
  spacer: {
    height: 120,
  },
});
