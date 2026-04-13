import { Pressable, StyleSheet, Text, View } from 'react-native';

import { mobileTheme } from '@/shared/theme/tokens';

import { AppIcon } from './app-icon';

interface MobileEmptyStateProps {
  iconName: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const MobileEmptyState = ({
  iconName,
  title,
  description,
  actionLabel,
  onAction,
}: MobileEmptyStateProps) => (
  <View style={styles.card}>
    <View style={styles.iconWrap}>
      <AppIcon color={mobileTheme.primary} name={iconName} size={30} />
    </View>
    <Text selectable style={styles.title}>
      {title}
    </Text>
    <Text selectable style={styles.description}>
      {description}
    </Text>
    {actionLabel && onAction ? (
      <Pressable onPress={onAction} style={styles.action}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primarySoft,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: mobileTheme.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: mobileTheme.mutedText,
    textAlign: 'center',
  },
  action: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primary,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
