import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BorderRadius, Colors, Spacing } from "../core/theme";

interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.labelContainer}>
        {label && <Text style={[styles.label, error && styles.errorText]}>{label}</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <RNTextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.slate[300]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.slate[700],
    paddingHorizontal: Spacing.xs,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#fff1e2ff",
    borderWidth: 2,
    borderColor: "rgba(238, 95, 43, 0.24)",
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    color: Colors.slate[900],
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    paddingHorizontal: Spacing.xs,
  },
});
