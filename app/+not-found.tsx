// Written by: Linh Tran
// Tested by: Evelyn Tran
// Debugged by: Allison Nguyen
import React from 'react';
import { View, Text } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Page not found</Text>
    </View>
  );
}