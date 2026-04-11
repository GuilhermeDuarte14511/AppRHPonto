interface DashboardTimeRecordExportItem {
  employeeName: string;
  department: string;
  recordedAtLabel: string;
  typeLabel: string;
  sourceLabel: string;
  statusLabel: string;
  attentionLabel: string;
  attentionDescription: string;
}

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

export const downloadRecentTimeRecordsCsv = (records: DashboardTimeRecordExportItem[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  const headers = [
    'Funcionário',
    'Departamento',
    'Horário',
    'Tipo',
    'Origem',
    'Status',
    'Atenção',
    'Detalhe',
  ];

  const lines = records.map((record) =>
    [
      record.employeeName,
      record.department,
      record.recordedAtLabel,
      record.typeLabel,
      record.sourceLabel,
      record.statusLabel,
      record.attentionLabel,
      record.attentionDescription,
    ]
      .map((value) => escapeCsvValue(value))
      .join(','),
  );

  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const fileName = `marcacoes-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
};
