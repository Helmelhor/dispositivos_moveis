// app/explore.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fazer algumas pesquisas seila</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FB',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
});
