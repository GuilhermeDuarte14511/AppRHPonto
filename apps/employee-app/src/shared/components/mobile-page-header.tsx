import { Pressable, StyleSheet, Text, View } from 'react-native';

import { mobileTheme } from '@/shared/theme/tokens';

import { AppIcon } from './app-icon';

interface MobilePageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}

export const MobilePageHeader = ({ title, subtitle, onBack, action }: MobilePageHeaderProps) => (
  <View style={styles.wrapper}>
    <View style={styles.topRow}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.iconButton}>
          <AppIcon color={mobileTheme.text} name="arrow-back-outline" size={20} />
        </Pressable>
      ) : (
        <View style={styles.iconSpacer} />
      )}

      <View style={styles.centerCopy}>
        <Text numberOfLines={1} selectable style={styles.title}>
          {title}
        </Text>
      </View>

      {action ? action : <View style={styles.iconSpacer} />}
    </View>

    {subtitle ? (
      <Text selectable style={styles.subtitle}>
        {subtitle}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  iconSpacer: {
    width: 42,
    height: 42,
  },
  centerCopy: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: mobileTheme.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
});
