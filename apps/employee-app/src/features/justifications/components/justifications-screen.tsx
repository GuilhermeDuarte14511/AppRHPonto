import { StyleSheet, Text, View } from 'react-native';

import { mobileTheme } from '@/shared/theme/tokens';

export const EmployeeJustificationsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Justificativas</Text>
    <View style={styles.card}>
      <Text style={styles.itemTitle}>Solicitar ajuste ou ausência</Text>
      <Text style={styles.itemText}>Fluxo preparado para anexos, documentos e imagens.</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mobileTheme.background,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    gap: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  itemText: {
    color: mobileTheme.mutedText,
  },
});

