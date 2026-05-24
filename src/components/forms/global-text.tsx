import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

const fontFamilyAlias: Record<string, string> = {
  'Manrope-Bold': 'Manrope_700Bold',
  'Manrope_700Bold': 'Manrope_700Bold',
  'Manrope-SemiBold': 'Manrope_600SemiBold',
  'Manrope_600SemiBold': 'Manrope_600SemiBold',
  'Manrope-Medium': 'Manrope_500Medium',
  'Manrope_500Medium': 'Manrope_500Medium',
  'Manrope-Regular': 'Manrope_400Regular',
  'Manrope_400Regular': 'Manrope_400Regular',
};

const resolveFontFamily = (style?: TextStyle | TextStyle[] | null): TextStyle => {
  const flattened = StyleSheet.flatten(style) as TextStyle | undefined;
  if (!flattened) {
    return { fontFamily: 'Manrope_400Regular' };
  }

  const resolvedFontFamily = typeof flattened.fontFamily === 'string'
    ? fontFamilyAlias[flattened.fontFamily] || flattened.fontFamily
    : undefined;

  let fontFamily = resolvedFontFamily;
  if (!fontFamily) {
    const weight = String(flattened.fontWeight || '').toLowerCase();
    if (weight === '700' || weight === 'bold' || weight === '800' || weight === '900') {
      fontFamily = 'Manrope_700Bold';
    } else if (weight === '600' || weight === 'semibold') {
      fontFamily = 'Manrope_600SemiBold';
    } else if (weight === '500' || weight === 'medium') {
      fontFamily = 'Manrope_500Medium';
    } else {
      fontFamily = 'Manrope_400Regular';
    }
  }

  return {
    ...flattened,
    fontFamily,
  };
};

export function AppText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[styles.defaultFont, resolveFontFamily(props.style)]}
    />
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Manrope_400Regular',
  },
});