import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

import { getPayrollOverview } from '../../payroll/lib/payroll-data-source';

const parseHoursLabelToMinutes = (value: string) => {
  const match = value.match(/([+-])?(\d+)h\s(\d+)m/);

  if (!match) {
    return 0;
  }

  const sign = match[1] === '-' ? -1 : 1;

  return sign * (Number(match[2]) * 60 + Number(match[3]));
};

const formatMinutes = (minutes: number) => {
  const absoluteValue = Math.abs(Math.round(minutes));
  const hours = Math.floor(absoluteValue / 60);
  const remainingMinutes = absoluteValue % 60;

  return `${hours}h ${String(remainingMinutes).padStart(2, '0')}m`;
};

export const getAnalyticsOverview = async () => {
  const [snapshot, payrollOverview] = await Promise.all([fetchAdminLiveDataSnapshot(), getPayrollOverview()]);
  const activeEmployees = snapshot.employees.filter((employee) => employee.isActive);
  const employeeCount = Math.max(activeEmployees.length, 1);
  const absenceCount = snapshot.justifications.filter((item) => item.type === 'absence').length;
  const absenteeismRate = `${((absenceCount / employeeCount) * 100).toFixed(1).replace('.', ',')}%`;
  const overtimeMinutes = payrollOverview.records.reduce(
    (total, record) => total + parseHoursLabelToMinutes(record.overtimeHoursLabel),
    0,
  );
  const overtimeAverage = formatMinutes(overtimeMinutes / employeeCount);
  const delayedEntries = snapshot.timeRecords.filter((record) => record.recordType === 'entry' && record.status !== 'valid');
  const punctualityIndex = `${Math.max(
    0,
    ((snapshot.timeRecords.filter((record) => record.recordType === 'entry').length - delayedEntries.length) /
      Math.max(snapshot.timeRecords.filter((record) => record.recordType === 'entry').length, 1)) *
      100,
  )
    .toFixed(1)
    .replace('.', ',')}%`;
  const overtimeCost = `R$ ${(overtimeMinutes / 60 * 42).toFixed(2).replace('.', ',')}`;

  const recentDays = Array.from(
    new Set(
      snapshot.timeRecords
        .map((record) => new Date(record.recordedAt).toISOString().slice(0, 10))
        .sort((left, right) => left.localeCompare(right)),
    ),
  ).slice(-13);

  const trend = recentDays.map((day) => {
    const dayRecords = snapshot.timeRecords.filter((record) => new Date(record.recordedAt).toISOString().slice(0, 10) === day);

    return {
      label: day.slice(-2),
      presence: Math.min(100, dayRecords.filter((record) => record.recordType === 'entry').length * 8),
      delays: Math.min(100, dayRecords.filter((record) => record.status !== 'valid').length * 12),
    };
  });

  const overtimeByDepartment = payrollOverview.records
    .reduce<Array<{ department: string; minutes: number }>>((items, record) => {
      const currentItem = items.find((item) => item.department === record.department);
      const minutes = parseHoursLabelToMinutes(record.overtimeHoursLabel);

      if (currentItem) {
        currentItem.minutes += minutes;
        return items;
      }

      items.push({
        department: record.department,
        minutes,
      });

      return items;
    }, [])
    .sort((left, right) => right.minutes - left.minutes)
    .slice(0, 7);

  const maxDepartmentMinutes = Math.max(...overtimeByDepartment.map((item) => item.minutes), 1);

  const delayHeatmap = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map((dayLabel, index) => {
    const values = Array.from({ length: 7 }).map((_, slotIndex) => {
      const dayRecords = delayedEntries.filter((record) => {
        const date = new Date(record.recordedAt);
        return date.getUTCDay() === index + 1 && Math.max(date.getUTCHours() - 7, 0) === slotIndex;
      });

      return Math.min(100, dayRecords.length * 24);
    });

    return { day: dayLabel, values };
  });

  const engagementRanking = payrollOverview.records
    .reduce<Array<{ department: string; score: number; members: number; pending: number }>>((items, record) => {
      const currentItem = items.find((item) => item.department === record.department);
      const score = record.status === 'validado' ? 100 : record.status === 'pendente' ? 90 : 82;
      const pending = record.status === 'validado' ? 0 : 1;

      if (currentItem) {
        currentItem.score += score;
        currentItem.members += 1;
        currentItem.pending += pending;
        return items;
      }

      items.push({
        department: record.department,
        score,
        members: 1,
        pending,
      });

      return items;
    }, [])
    .map((item, index, array) => {
      const averageScore = item.score / item.members;
      const previousAverage = array[index - 1] ? array[index - 1].score / array[index - 1].members : averageScore;

      return {
        department: item.department,
        score: `${averageScore.toFixed(1).replace('.', ',')}%`,
        trend: averageScore > previousAverage ? 'up' : averageScore < previousAverage ? 'down' : 'stable',
        members: item.members,
      };
    })
    .sort(
      (left, right) =>
        Number(right.score.replace(/[^\d,]/g, '').replace(',', '.')) -
        Number(left.score.replace(/[^\d,]/g, '').replace(',', '.')),
    )
    .slice(0, 5);

  const topDelayDepartment = payrollOverview.records.find((record) => record.status !== 'validado')?.department ?? 'Operações';
  const topOvertimeDepartment = overtimeByDepartment[0]?.department ?? 'Operações';

  return {
    periodLabel: 'Últimos 30 dias',
    metrics: {
      absenteeismRate,
      overtimeAverage,
      punctualityIndex,
      overtimeCost,
    },
    trend,
    overtimeByDepartment: overtimeByDepartment.map((item) => ({
      department: item.department,
      hours: formatMinutes(item.minutes),
      percent: Math.round((item.minutes / maxDepartmentMinutes) * 100),
    })),
    delayHeatmap,
    engagementRanking,
    insights: [
      {
        id: 'insight-delays',
        title: `${topDelayDepartment} concentra mais pendências de pontualidade`,
        description: 'O volume de registros fora do padrão sugere revisão de jornada e reforço de acompanhamento.',
      },
      {
        id: 'insight-overtime',
        title: `${topOvertimeDepartment} lidera a carga de horas extras do período`,
        description: 'A área segue puxando o custo excedente e merece revisão de capacidade operacional.',
      },
      {
        id: 'insight-coverage',
        title: 'A leitura já usa dados reais do fechamento operacional',
        description: 'Os indicadores são derivados de marcações, justificativas e histórico de fechamento persistidos no banco.',
      },
    ],
  };
};
