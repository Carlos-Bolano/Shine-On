import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import { Gradients } from "../core/theme";

interface GradientBackgroundProps extends ViewProps {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors = Gradients.dopamine,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
  style,
  ...props
}) => {
  return (
    <LinearGradient colors={colors} start={start} end={end} style={[styles.gradient, style]} {...props}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
