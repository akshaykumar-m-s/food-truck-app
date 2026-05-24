import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../src/components/forms/global-text';

export default function Home() {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Welcome to the App 🎉</AppText>
      <AppText style={styles.subtitle}>You are logged in!</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#666' },
});
