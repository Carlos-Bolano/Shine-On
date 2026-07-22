import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  { id: "sunrise", name: "Sunrise", colors: ["#fef3c7", "#fde68a", "#fbbf24"] },
  { id: "ocean", name: "Ocean", colors: ["#dbeafe", "#93c5fd", "#3b82f6"] },
  { id: "forest", name: "Forest", colors: ["#d1fae5", "#6ee7b7", "#059669"] },
  { id: "lavender", name: "Lavender", colors: ["#ede9fe", "#c4b5fd", "#8b5cf6"] },
  { id: "midnight", name: "Midnight", colors: ["#1e293b", "#334155", "#475569"] },
  { id: "peach", name: "Peach", colors: ["#fff1f2", "#fecdd3", "#fb923c"] },
  { id: "mint", name: "Mint", colors: ["#ecfdf5", "#a7f3d0", "#34d399"] },
];

const FONT_OPTIONS = [
  { id: "jakarta", name: "Jakarta Sans", variant: "display" as const },
  { id: "serif", name: "Modern Serif", variant: "serif" as const },
  { id: "cormorant", name: "Cormorant", variant: "cormorant" as const },
  { id: "lora", name: "Lora", variant: "lora" as const },
  { id: "dmSans", name: "DM Sans", variant: "dmSans" as const },
  { id: "nunito", name: "Nunito", variant: "nunito" as const },
  { id: "playfair", name: "Playfair", variant: "playfair" as const },
  { id: "mono", name: "Classic Mono", variant: "mono" as const },
];

const TEXT_COLORS = [
  { id: "dark", color: "#0f172a", label: "Oscuro" },
  { id: "primary", color: "#ee5f2b", label: "Naranja" },
  { id: "white", color: "#ffffff", label: "Blanco" },
  { id: "slate", color: "#475569", label: "Gris" },
  { id: "emerald", color: "#059669", label: "Verde" },
  { id: "violet", color: "#7c3aed", label: "Violeta" },
  { id: "rose", color: "#e11d48", label: "Rosa" },
  { id: "amber", color: "#d97706", label: "Ámbar" },
];

const ALIGN_OPTIONS = [
  { id: "left", icon: "format-align-left" as const },
  { id: "center", icon: "format-align-center" as const },
  { id: "right", icon: "format-align-right" as const },
];

const AUTHOR_STYLES = [
  { id: "dash", format: (a: string) => `— ${a}` },
  { id: "by", format: (a: string) => `— by ${a}` },
  { id: "name", format: (a: string) => a },
  { id: "quoted", format: (a: string) => `"${a}"` },
];

const TEXT_SIZES = [
  { id: "sm", label: "A", size: "2xl" as const },
  { id: "md", label: "A", size: "3xl" as const },
  { id: "lg", label: "A", size: "4xl" as const },
];

export default function CustomizerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const previewRef = useRef<View>(null);

  const [userName, setUserName] = useState("Alex Chen");
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_OPTIONS[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLORS[0]);
  const [textAlign, setTextAlign] = useState("center");
  const [selectedAuthorStyle, setSelectedAuthorStyle] = useState(AUTHOR_STYLES[0]);
  const [selectedTextSize, setSelectedTextSize] = useState(TEXT_SIZES[1]);
  const [showLogo, setShowLogo] = useState(true);
  const [showQuoteMark, setShowQuoteMark] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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
    if (isSharing) return;
    setIsSharing(true);
    try {
      const uri = await captureImage();
      if (!uri) return;

      await Share.share({
        url: uri,
        message: "Check out my quote from Shine On!",
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error("Share failed:", e);
      Alert.alert("Error", "No se pudo compartir la imagen");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const uri = await captureImage();
      if (!uri) return;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos permiso para guardar la imagen en tu galería");
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("Shine On");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album);
      } else {
        await MediaLibrary.createAlbumAsync("Shine On", asset);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Listo", "Imagen guardada en tu galería");
    } catch (e) {
      console.error("Save failed:", e);
      Alert.alert("Error", "No se pudo guardar la imagen");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    return !value;
  };

  const isProcessing = isSaving || isSharing;
  const authorText = (Array.isArray(params.author) ? params.author[0] : params.author) || "Peter Drucker";
  const isDarkBg = selectedBg.id === "midnight";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()} disabled={isProcessing}>
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
              <View ref={previewRef} collapsable={false} style={styles.preview}>
                <GradientBackground colors={selectedBg.colors} style={styles.previewGradient}>
                  {showLogo && (
                    <View style={styles.previewTop}>
                      <MaterialIcons name="auto-awesome" size={20} color={Colors.primary} />
                      <Typography
                        size="xs"
                        weight="bold"
                        color={isDarkBg ? "rgba(255,255,255,0.6)" : "rgba(15, 23, 42, 0.6)"}
                        style={styles.previewLogoText}
                      >
                        Shine On
                      </Typography>
                    </View>
                  )}

                  <View
                    style={[
                      styles.previewContent,
                      {
                        alignItems:
                          textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center",
                      },
                    ]}
                  >
                    {showQuoteMark && (
                      <MaterialIcons
                        name="format-quote"
                        size={40}
                        color={Colors.primary}
                        style={[
                          styles.quoteIcon,
                          textAlign === "left" && styles.quoteIconLeft,
                          textAlign === "right" && styles.quoteIconRight,
                        ]}
                      />
                    )}
                    <Typography
                      variant={selectedFont.variant}
                      size={selectedTextSize.size}
                      weight={selectedFont.variant === "display" ? "bold" : undefined}
                      italic={selectedFont.variant === "serif" || selectedFont.variant === "playfair"}
                      color={selectedTextColor.color}
                      style={[styles.previewText, { textAlign: textAlign as any }]}
                    >
                      {params.text || "The best way to predict the future is to create it."}
                    </Typography>
                    <View
                      style={[
                        styles.previewDivider,
                        textAlign === "left" && styles.previewDividerLeft,
                        textAlign === "right" && styles.previewDividerRight,
                      ]}
                    />
                    <Typography
                      size="lg"
                      weight="medium"
                      color={isDarkBg ? "#ffffff" : Colors.primary}
                      style={{ textAlign: textAlign as any }}
                    >
                      {selectedAuthorStyle.format(authorText)}
                    </Typography>
                  </View>

                  {showSignature && (
                    <View style={styles.previewBottom}>
                      <Typography
                        size="xs"
                        weight="medium"
                        color={isDarkBg ? "rgba(255,255,255,0.5)" : Colors.slate[500]}
                      >
                        shared by{" "}
                        <Typography size="xs" weight="medium" color={isDarkBg ? "#ffffff" : Colors.primary}>
                          {userName}
                        </Typography>
                      </Typography>
                    </View>
                  )}
                </GradientBackground>
              </View>
            </View>
            <Typography size="sm" weight="medium" color={Colors.slate[500]} style={styles.previewLabel}>
              9:16 Preview for Stories
            </Typography>
          </View>

          <View style={styles.controls}>
            {/* Name Input */}
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
                  editable={!isProcessing}
                />
              </View>
            </View>

            {/* Text Alignment */}
            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Text Alignment
              </Typography>
              <View style={styles.alignRow}>
                {ALIGN_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.alignButton, textAlign === opt.id && styles.alignButtonActive]}
                    onPress={() => {
                      setTextAlign(opt.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={isProcessing}
                  >
                    <MaterialIcons
                      name={opt.icon}
                      size={22}
                      color={textAlign === opt.id ? "#fff" : Colors.slate[600]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Text Color */}
            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Text Color
              </Typography>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsRow}
              >
                {TEXT_COLORS.map((tc) => (
                  <TouchableOpacity
                    key={tc.id}
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedTextColor(tc);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={isProcessing}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: tc.color },
                        selectedTextColor.id === tc.id && styles.colorCircleActive,
                        tc.id === "white" && styles.colorCircleWhite,
                      ]}
                    />
                    <Typography
                      size="xs"
                      weight={selectedTextColor.id === tc.id ? "bold" : "medium"}
                      color={selectedTextColor.id === tc.id ? Colors.slate[900] : Colors.slate[500]}
                    >
                      {tc.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Text Size */}
            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Text Size
              </Typography>
              <View style={styles.alignRow}>
                {TEXT_SIZES.map((ts) => (
                  <TouchableOpacity
                    key={ts.id}
                    style={[styles.alignButton, selectedTextSize.id === ts.id && styles.alignButtonActive]}
                    onPress={() => {
                      setSelectedTextSize(ts);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={isProcessing}
                  >
                    <Typography
                      size={ts.id === "sm" ? "sm" : ts.id === "md" ? "base" : "xl"}
                      weight="bold"
                      color={selectedTextSize.id === ts.id ? "#fff" : Colors.slate[600]}
                    >
                      {ts.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Author Style */}
            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Author Style
              </Typography>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsRow}
              >
                {AUTHOR_STYLES.map((as) => (
                  <TouchableOpacity
                    key={as.id}
                    style={[styles.fontButton, selectedAuthorStyle.id === as.id && styles.fontButtonActive]}
                    onPress={() => {
                      setSelectedAuthorStyle(as);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={isProcessing}
                  >
                    <Typography
                      size="sm"
                      weight={selectedAuthorStyle.id === as.id ? "bold" : "medium"}
                      color={selectedAuthorStyle.id === as.id ? "#fff" : Colors.slate[900]}
                    >
                      {as.format("Author")}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Background */}
            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Background
              </Typography>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsRow}
              >
                {BACKGROUND_OPTIONS.map((bg) => (
                  <TouchableOpacity
                    key={bg.id}
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedBg(bg);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={isProcessing}
                  >
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

            {/* Typography */}
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
                    onPress={() => {
                      setSelectedFont(font);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={isProcessing}
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

            {/* Element Toggles */}
            <View style={styles.controlSection}>
              <Typography size="base" weight="bold" style={styles.sectionLabel}>
                Elements
              </Typography>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleButton, showLogo && styles.toggleButtonActive]}
                  onPress={async () => {
                    setShowLogo(await handleToggle(showLogo));
                  }}
                  disabled={isProcessing}
                >
                  <MaterialIcons
                    name="auto-awesome"
                    size={20}
                    color={showLogo ? "#fff" : Colors.slate[600]}
                  />
                  <Typography size="xs" weight="bold" color={showLogo ? "#fff" : Colors.slate[600]}>
                    Logo
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleButton, showQuoteMark && styles.toggleButtonActive]}
                  onPress={async () => {
                    setShowQuoteMark(await handleToggle(showQuoteMark));
                  }}
                  disabled={isProcessing}
                >
                  <MaterialIcons
                    name="format-quote"
                    size={20}
                    color={showQuoteMark ? "#fff" : Colors.slate[600]}
                  />
                  <Typography size="xs" weight="bold" color={showQuoteMark ? "#fff" : Colors.slate[600]}>
                    Comillas
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleButton, showSignature && styles.toggleButtonActive]}
                  onPress={async () => {
                    setShowSignature(await handleToggle(showSignature));
                  }}
                  disabled={isProcessing}
                >
                  <MaterialIcons name="person" size={20} color={showSignature ? "#fff" : Colors.slate[600]} />
                  <Typography size="xs" weight="bold" color={showSignature ? "#fff" : Colors.slate[600]}>
                    Firma
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, isProcessing && styles.disabledButton]}
              onPress={handleSave}
              disabled={isProcessing}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <MaterialIcons name="save-alt" size={20} color={Colors.primary} />
              )}
              <Typography size="sm" weight="bold" color={Colors.primary}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Typography>
            </TouchableOpacity>
            <PremiumButton
              title={isSharing ? "Compartiendo..." : "Compartir"}
              onPress={handleShare}
              style={styles.primaryButton}
              disabled={isProcessing}
            />
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
    overflow: "hidden",
  },
  previewGradient: {
    flex: 1,
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
    width: "100%",
  },
  quoteIcon: {
    opacity: 0.4,
    marginBottom: Spacing.md,
    alignSelf: "center",
  },
  quoteIconLeft: {
    alignSelf: "flex-start",
  },
  quoteIconRight: {
    alignSelf: "flex-end",
  },
  previewText: {
    lineHeight: 40,
  },
  previewDivider: {
    width: 48,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginVertical: Spacing.lg,
    alignSelf: "center",
  },
  previewDividerLeft: {
    alignSelf: "flex-start",
  },
  previewDividerRight: {
    alignSelf: "flex-end",
  },
  previewBottom: {},
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
  disabledButton: {
    opacity: 0.5,
  },
  spacer: {
    height: 120,
  },
  alignRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  alignButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.default,
    backgroundColor: "rgba(238, 95, 43, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(238, 95, 43, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  alignButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  colorCircleWhite: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  toggleRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.default,
    backgroundColor: "rgba(238, 95, 43, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(238, 95, 43, 0.2)",
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
