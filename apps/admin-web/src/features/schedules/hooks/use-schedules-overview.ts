'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  timeZone: 'UTC',
});

const toneByScheduleName = (name: string) => {
  if (/noturn/i.test(name)) {
    return 'secondary';
  }

  if (/plant|sobre|cobertura/i.test(name)) {
    return 'warning';
  }

  if (/atendimento|suporte/i.test(name)) {
    return 'success';
  }

  if (/folga/i.test(name)) {
    return 'neutral';
  }

  return 'primary';
};

export const useSchedulesOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.schedules,
    queryFn: async () => {
      const snapshot = await fetchAdminLiveDataSnapshot();
      const today = new Date();
      const days = Array.from({ length: 6 }).map((_, index) => {
        const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + index));
        const [label, dayNumber] = dayFormatter.format(date).replace('.', '').split(', ');

        return {
          id: date.toISOString().slice(0, 10),
          label: label.replace(/^\w/, (character) => character.toUpperCase()),
          date: dayNumber,
        };
      });

      const assignments = snapshot.employees
        .filter((employee) => employee.isActive)
        .slice(0, 8)
        .map((employee) => {
          const scheduleHistory =
            snapshot.employeeScheduleHistories.find((history) => history.employeeId === employee.id && history.isCurrent) ??
            snapshot.employeeScheduleHistories.find((history) => history.employeeId === employee.id);
          const schedule =
            snapshot.workSchedules.find((item) => item.id === scheduleHistory?.workScheduleId) ??
            snapshot.workSchedules.find((item) => item.isActive) ??
            null;

          return {
            id: employee.id,
            employeeName: employee.fullName,
            position: employee.position ?? 'Cargo não informado',
            shifts: days.map((day, dayIndex) => {
              const isWeekendCoverage = dayIndex === 5 && schedule != null;

              return {
                dayId: day.id,
                name: schedule?.name ?? 'Sem escala',
                hours: schedule ? `${schedule.startTime} - ${schedule.endTime}` : 'A definir',
                tone: isWeekendCoverage ? 'warning' : toneByScheduleName(schedule?.name ?? 'Sem escala'),
              };
            }),
          };
        });

      const shiftLibrary = snapshot.workSchedules.map((schedule) => ({
        id: schedule.id,
        name: schedule.name,
        hours: `${schedule.startTime} - ${schedule.endTime}`,
        tone: toneByScheduleName(schedule.name),
      }));

      const employeesWithoutSchedule = snapshot.employees.filter(
        (employee) =>
          !snapshot.employeeScheduleHistories.some((history) => history.employeeId === employee.id && history.isCurrent),
      );
      const inactiveDevices = snapshot.devices.filter((device) => !device.isActive);

      return {
        days,
        assignments,
        shiftLibrary,
        alerts: [
          {
            id: 'schedule-alert-unassigned',
            title: `${employeesWithoutSchedule.length} colaboradores sem escala atual`,
            description: 'Revise os vínculos ativos para evitar lacunas de planejamento na próxima semana.',
          },
          {
            id: 'schedule-alert-devices',
            title: `${inactiveDevices.length} dispositivos precisam de atenção`,
            description: 'Kiosks ou terminais inativos podem impactar a cobertura operacional da escala.',
          },
        ],
        summary: {
          allocatedTeam: `${Math.round(
            (assignments.length / Math.max(snapshot.employees.filter((employee) => employee.isActive).length, 1)) * 100,
          )}%`,
          conflicts: employeesWithoutSchedule.length,
          plannedHours: `${snapshot.workSchedules.reduce(
            (total, schedule) => total + (schedule.expectedDailyMinutes ?? 0),
            0,
          )}h`,
          status: inactiveDevices.length === 0 ? 'Publicado' : 'Revisão pendente',
        },
      };
    },
    enabled,
  });
};
