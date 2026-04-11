import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import type { PayrollRecordDetail } from './payroll-data-source';

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  header: {
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
  },
  companyName: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
  },
  title: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 9,
    textAlign: 'center',
  },
  section: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 10,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  field: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  fieldLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  fieldValue: {
    marginTop: 4,
    fontSize: 9.5,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryCard: {
    width: '31%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: 700,
  },
  summaryHint: {
    marginTop: 3,
    fontSize: 8,
  },
  table: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#111827',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  tableCell: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  tableHeaderCell: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: 'uppercase',
    borderRightWidth: 1,
    borderRightColor: '#111827',
  },
  widthDate: { width: '10%' },
  widthWeekday: { width: '10%' },
  widthSource: { width: '12%' },
  widthTime: { width: '8%' },
  widthHours: { width: '8%' },
  widthBalance: { width: '8%' },
  widthNotes: { width: '20%' },
  totalsRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  totalsCard: {
    width: '31%',
    borderWidth: 1,
    borderColor: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  totalsLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  totalsValue: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: 700,
  },
  noteBlock: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 10,
  },
  noteText: {
    fontSize: 8.5,
    lineHeight: 1.5,
  },
  signaturesSection: {
    marginTop: 18,
  },
  signaturesGrid: {
    marginTop: 26,
    flexDirection: 'row',
    gap: 12,
  },
  signatureBox: {
    flex: 1,
    minHeight: 86,
    justifyContent: 'flex-end',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#111827',
    paddingTop: 6,
  },
  signatureName: {
    fontSize: 8.5,
    fontWeight: 700,
    textAlign: 'center',
  },
  signatureRole: {
    marginTop: 2,
    fontSize: 7.5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7.5,
  },
});

const SummaryCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) => (
  <View style={styles.summaryCard} wrap={false}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryHint}>{hint}</Text>
  </View>
);

export const PayrollPdfDocument = ({ record }: { record: PayrollRecordDetail }) => (
  <Document
    author="Chronos Precision"
    creator="App RH Ponto"
    keywords="folha de ponto, espelho, rh"
    language="pt-BR"
    subject={`Folha de ponto de ${record.employeeName}`}
    title={`Folha de ponto - ${record.employeeName}`}
  >
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{record.companyName}</Text>
        <Text style={styles.title}>Folha de ponto</Text>
        <Text style={styles.subtitle}>
          Competência {record.periodLabel} · período de {record.periodStartLabel} a {record.periodEndLabel}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do colaborador</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nome</Text>
            <Text style={styles.fieldValue}>{record.employeeName}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Matrícula</Text>
            <Text style={styles.fieldValue}>{record.registrationNumber}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>CPF</Text>
            <Text style={styles.fieldValue}>{record.employeeCpf}</Text>
          </View>
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Departamento</Text>
            <Text style={styles.fieldValue}>{record.department}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Cargo</Text>
            <Text style={styles.fieldValue}>{record.role}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Jornada</Text>
            <Text style={styles.fieldValue}>{record.scheduleLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo de horas</Text>
        <View style={styles.summaryGrid}>
          <SummaryCard hint="Carga horária do período." label="Horas normais" value={record.normalHoursLabel} />
          <SummaryCard hint="Total apurado na competência." label="Horas trabalhadas" value={record.workedHoursLabel} />
          <SummaryCard hint="Horas acima da jornada regular." label="Horas extras" value={record.overtimeHoursLabel} />
          <SummaryCard hint="Adicional 50%." label="Extras 50%" value={record.overtime50HoursLabel} />
          <SummaryCard hint="Adicional 100%." label="Extras 100%" value={record.overtime100HoursLabel} />
          <SummaryCard hint="Saldo final do período." label="Banco de horas" value={record.bankHoursLabel} />
          <SummaryCard hint="Tempo total de atraso." label="Atrasos" value={record.lateHoursLabel} />
          <SummaryCard hint="Horas abonadas." label="Ausências abonadas" value={record.approvedAbsencesLabel} />
          <SummaryCard hint="Horas sem abono." label="Ausências não abonadas" value={record.unapprovedAbsencesLabel} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marcações do período</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.widthDate]}>Data</Text>
            <Text style={[styles.tableHeaderCell, styles.widthWeekday]}>Semana</Text>
            <Text style={[styles.tableHeaderCell, styles.widthSource]}>Origem</Text>
            <Text style={[styles.tableHeaderCell, styles.widthTime]}>E1</Text>
            <Text style={[styles.tableHeaderCell, styles.widthTime]}>S1</Text>
            <Text style={[styles.tableHeaderCell, styles.widthTime]}>E2</Text>
            <Text style={[styles.tableHeaderCell, styles.widthTime]}>S2</Text>
            <Text style={[styles.tableHeaderCell, styles.widthHours]}>Normais</Text>
            <Text style={[styles.tableHeaderCell, styles.widthHours]}>Extras</Text>
            <Text style={[styles.tableHeaderCell, styles.widthBalance]}>Saldo</Text>
            <Text style={[styles.tableHeaderCell, styles.widthNotes, { borderRightWidth: 0 }]}>Observações</Text>
          </View>

          {record.days.map((day) => (
            <View key={day.id} style={styles.tableRow} wrap={false}>
              <Text style={[styles.tableCell, styles.widthDate]}>{day.date}</Text>
              <Text style={[styles.tableCell, styles.widthWeekday]}>{day.weekday}</Text>
              <Text style={[styles.tableCell, styles.widthSource]}>{day.sourceLabel}</Text>
              <Text style={[styles.tableCell, styles.widthTime]}>{day.firstEntry ?? '-'}</Text>
              <Text style={[styles.tableCell, styles.widthTime]}>{day.firstExit ?? '-'}</Text>
              <Text style={[styles.tableCell, styles.widthTime]}>{day.secondEntry ?? '-'}</Text>
              <Text style={[styles.tableCell, styles.widthTime]}>{day.secondExit ?? '-'}</Text>
              <Text style={[styles.tableCell, styles.widthHours]}>{day.regularHours}</Text>
              <Text style={[styles.tableCell, styles.widthHours]}>{day.overtimeHours}</Text>
              <Text style={[styles.tableCell, styles.widthBalance]}>{day.balance}</Text>
              <Text style={[styles.tableCell, styles.widthNotes, { borderRightWidth: 0 }]}>
                {day.note ?? '-'}{day.occurrenceDetail ? ` · ${day.occurrenceDetail}` : ''}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsRow}>
          <View style={styles.totalsCard}>
            <Text style={styles.totalsLabel}>Horas normais</Text>
            <Text style={styles.totalsValue}>{record.normalHoursLabel}</Text>
          </View>
          <View style={styles.totalsCard}>
            <Text style={styles.totalsLabel}>Horas extras</Text>
            <Text style={styles.totalsValue}>{record.overtimeHoursLabel}</Text>
          </View>
          <View style={styles.totalsCard}>
            <Text style={styles.totalsLabel}>Banco de horas</Text>
            <Text style={styles.totalsValue}>{record.bankHoursLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.noteBlock}>
        <Text style={styles.sectionTitle}>Observações de conferência</Text>
        <Text style={styles.noteText}>
          Status da folha: {record.validationStatusLabel}. {record.validationHint}
        </Text>
        <Text style={[styles.noteText, { marginTop: 6 }]}>
          Gestor imediato: {record.managerName}. Gestor de RH: {record.rhManagerName}.
        </Text>
      </View>

      <View style={styles.signaturesSection}>
        <Text style={styles.sectionTitle}>Assinaturas</Text>
        <View style={styles.signaturesGrid}>
          {record.signatures.map((signature) => (
            <View key={signature.id} style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>{signature.name}</Text>
                <Text style={styles.signatureRole}>{signature.label}</Text>
                <Text style={styles.signatureRole}>{signature.role}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Documento gerado em {record.generatedAtLabel}</Text>
        <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
      </View>
    </Page>
  </Document>
);
