import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { mobileTheme } from '@/shared/theme/tokens';

export const AuthTransitionScreen = ({
  title = 'Validando acesso',
  description = 'Estamos preparando seu ambiente para continuar com segurança.',
}: {
  title?: string;
  description?: string;
}) => (
  <View style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>PE</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <ActivityIndicator color={mobileTheme.primary} size="small" style={styles.loader} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mobileTheme.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
    shadowColor: mobileTheme.primary,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 3,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primary,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -1,
  },
  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '800',
    color: mobileTheme.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
    textAlign: 'center',
  },
  loader: {
    marginTop: 8,
  },
});
