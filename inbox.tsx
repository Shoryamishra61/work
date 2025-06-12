import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from './components/StyledText'; // Assuming components is at root
import theme from './styles/theme'; // Assuming styles is at root

export default function InboxScreen() {
  return (
    <View style={styles.container}>
      <StyledText variant="h1" color="text">Inbox Screen</StyledText>
      <StyledText variant="body" color="textSecondary" style={{ marginTop: theme.spacing.md }}>
        This is a placeholder for the Inbox functionality.
      </StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});
