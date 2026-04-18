import { StyleSheet, View } from 'react-native';

import { mobileTheme } from '@/shared/theme/tokens';

interface MobileSkeletonBlockProps {
  height: number;
  width?: number | `${number}%`;
  radius?: number;
}

export const MobileSkeletonBlock = ({ height, radius = 14, width = '100%' }: MobileSkeletonBlockProps) => (
  <View
    style={[
      styles.block,
      {
        height,
        width,
        borderRadius: radius,
      },
    ]}
  />
);

interface MobileListSkeletonProps {
  itemCount?: number;
  showHero?: boolean;
}

export const MobileListSkeleton = ({ itemCount = 3, showHero = true }: MobileListSkeletonProps) => (
  <View style={styles.wrapper}>
    {showHero ? (
      <View style={styles.heroCard}>
        <MobileSkeletonBlock height={12} width="28%" radius={999} />
        <MobileSkeletonBlock height={28} width="72%" />
        <MobileSkeletonBlock height={16} width="100%" />
        <MobileSkeletonBlock height={16} width="84%" />
      </View>
    ) : null}

    <View style={styles.list}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <View key={`mobile-list-skeleton-${index}`} style={styles.listCard}>
          <MobileSkeletonBlock height={52} radius={18} width={52} />
          <View style={styles.listCardCopy}>
            <MobileSkeletonBlock height={12} width="34%" radius={999} />
            <MobileSkeletonBlock height={18} width="74%" />
            <MobileSkeletonBlock height={14} width="100%" />
            <MobileSkeletonBlock height={14} width="82%" />
          </View>
        </View>
      ))}
    </View>
  </View>
);

interface MobileDetailSkeletonProps {
  sectionCount?: number;
}

export const MobileDetailSkeleton = ({ sectionCount = 3 }: MobileDetailSkeletonProps) => (
  <View style={styles.wrapper}>
    <View style={styles.heroCard}>
      <MobileSkeletonBlock height={12} width="26%" radius={999} />
      <MobileSkeletonBlock height={36} width="44%" />
      <MobileSkeletonBlock height={16} width="48%" />
    </View>

    {Array.from({ length: sectionCount }).map((_, index) => (
      <View key={`mobile-detail-skeleton-${index}`} style={styles.sectionCard}>
        <MobileSkeletonBlock height={14} width="30%" radius={999} />
        <MobileSkeletonBlock height={16} width="100%" />
        <MobileSkeletonBlock height={16} width="88%" />
        <MobileSkeletonBlock height={16} width="76%" />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  heroCard: {
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 22,
    gap: 10,
  },
  list: {
    gap: 14,
  },
  listCard: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  listCardCopy: {
    flex: 1,
    gap: 8,
  },
  sectionCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 12,
  },
  block: {
    backgroundColor: mobileTheme.surfaceLow,
  },
});
