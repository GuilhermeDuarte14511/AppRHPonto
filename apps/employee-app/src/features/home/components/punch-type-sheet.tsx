import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { TimeRecordType } from '@rh-ponto/types';

import { AppIcon } from '@/shared/components/app-icon';
import { mobileTheme } from '@/shared/theme/tokens';

import { timeRecordTypeLabels } from '@/features/time-records/lib/time-record-mobile';

const recordTypeDescriptions: Record<TimeRecordType, string> = {
  entry: 'Use quando estiver iniciando sua jornada.',
  break_start: 'Use ao sair para o almoço ou intervalo principal.',
  break_end: 'Use quando retornar do almoço ou intervalo.',
  exit: 'Use ao encerrar sua jornada de trabalho.',
};

const recordTypeIcons: Record<TimeRecordType, string> = {
  entry: 'log-in-outline',
  break_start: 'restaurant-outline',
  break_end: 'cafe-outline',
  exit: 'log-out-outline',
};

const recordTypeOptions: TimeRecordType[] = ['entry', 'break_start', 'break_end', 'exit'];

interface PunchTypeSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (value: TimeRecordType) => void;
  selectedType: TimeRecordType | null;
  recommendedType: TimeRecordType | null;
}

export const PunchTypeSheet = ({
  isVisible,
  onClose,
  onConfirm,
  selectedType,
  recommendedType,
}: PunchTypeSheetProps) => (
  <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <Pressable style={styles.backdropTouch} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Selecionar batida</Text>
            <Text style={styles.title}>Qual ponto você vai registrar?</Text>
            <Text style={styles.subtitle}>
              Escolha o tipo correto antes de abrir a câmera. A sugestão do sistema aparece destacada.
            </Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
            <AppIcon color={mobileTheme.text} name="close" size={20} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {recordTypeOptions.map((option) => {
            const isSelected = option === selectedType;
            const isRecommended = recommendedType != null && option === recommendedType;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => onConfirm(option)}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              >
                <View style={[styles.optionIcon, isSelected && styles.optionIconSelected]}>
                  <AppIcon
                    color={isSelected ? '#ffffff' : mobileTheme.primary}
                    name={recordTypeIcons[option]}
                    size={22}
                  />
                </View>
                <View style={styles.optionCopy}>
                  <View style={styles.optionTitleRow}>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {timeRecordTypeLabels[option]}
                    </Text>
                    {isRecommended ? (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedBadgeText}>Sugerido</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.optionDescription, isSelected && styles.optionDescriptionSelected]}>
                    {recordTypeDescriptions[option]}
                  </Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.32)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: mobileTheme.surfaceRaised,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
    gap: 18,
  },
  grabber: {
    alignSelf: 'center',
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#dbe3f0',
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceLow,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: mobileTheme.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  list: {
    gap: 12,
    paddingBottom: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 16,
  },
  optionCardSelected: {
    backgroundColor: mobileTheme.primary,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf4ff',
  },
  optionIconSelected: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  optionTitleSelected: {
    color: '#ffffff',
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: mobileTheme.mutedText,
  },
  optionDescriptionSelected: {
    color: 'rgba(255,255,255,0.84)',
  },
  recommendedBadge: {
    borderRadius: 999,
    backgroundColor: '#e8f1ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: mobileTheme.primary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#c9d7ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#ffffff',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
});
