import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { Colors, Typography as Typo } from "../core/theme";

type FontVariant =
  | "display"
  | "serif"
  | "cormorant"
  | "lora"
  | "dmSans"
  | "nunito"
  | "playfair"
  | "mono";

interface CustomTextProps extends TextProps {
  variant?: FontVariant;
  size?: keyof typeof Typo.fontSize;
  weight?: "regular" | "medium" | "semiBold" | "bold" | "extrabold";
  italic?: boolean;
  color?: string;
}

export const Typography: React.FC<CustomTextProps> = ({
  children,
  variant = "display",
  size = "base",
  weight = "regular",
  italic = false,
  color = Colors.slate[900],
  style,
  ...props
}) => {
  let fontFamily: string = Typo.fontFamily.display.regular;

  switch (variant) {
    case "serif":
      fontFamily = italic
        ? Typo.fontFamily.serif.italic
        : Typo.fontFamily.serif.regular;
      break;

    case "cormorant":
      if (italic) {
        fontFamily = weight === "semiBold"
          ? Typo.fontFamily.cormorant.semiBoldItalic
          : Typo.fontFamily.cormorant.italic;
      } else {
        if (weight === "bold") fontFamily = Typo.fontFamily.cormorant.bold;
        else if (weight === "semiBold") fontFamily = Typo.fontFamily.cormorant.semiBold;
        else if (weight === "medium") fontFamily = Typo.fontFamily.cormorant.medium;
        else fontFamily = Typo.fontFamily.cormorant.regular;
      }
      break;

    case "lora":
      if (italic) {
        fontFamily = weight === "semiBold"
          ? Typo.fontFamily.lora.semiBoldItalic
          : Typo.fontFamily.lora.italic;
      } else {
        if (weight === "bold") fontFamily = Typo.fontFamily.lora.bold;
        else if (weight === "semiBold") fontFamily = Typo.fontFamily.lora.semiBold;
        else if (weight === "medium") fontFamily = Typo.fontFamily.lora.medium;
        else fontFamily = Typo.fontFamily.lora.regular;
      }
      break;

    case "dmSans":
      if (italic) {
        fontFamily = Typo.fontFamily.dmSans.italic;
      } else {
        if (weight === "bold") fontFamily = Typo.fontFamily.dmSans.bold;
        else if (weight === "medium") fontFamily = Typo.fontFamily.dmSans.medium;
        else fontFamily = Typo.fontFamily.dmSans.regular;
      }
      break;

    case "nunito":
      if (weight === "bold") fontFamily = Typo.fontFamily.nunito.bold;
      else if (weight === "semiBold") fontFamily = Typo.fontFamily.nunito.semiBold;
      else fontFamily = Typo.fontFamily.nunito.regular;
      break;

    case "playfair":
      if (italic) {
        fontFamily = Typo.fontFamily.playfair.italic;
      } else {
        if (weight === "bold") fontFamily = Typo.fontFamily.playfair.bold;
        else fontFamily = Typo.fontFamily.playfair.regular;
      }
      break;

    case "mono":
      fontFamily = Typo.fontFamily.mono.regular;
      break;

    case "display":
    default:
      if (weight === "extrabold") fontFamily = Typo.fontFamily.display.extrabold;
      else if (weight === "bold") fontFamily = Typo.fontFamily.display.bold;
      else if (weight === "medium") fontFamily = Typo.fontFamily.display.medium;
      else fontFamily = Typo.fontFamily.display.regular;
      break;
  }

  return (
    <Text
      style={[
        styles.base,
        {
          fontFamily,
          fontSize: Typo.fontSize[size],
          color,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
