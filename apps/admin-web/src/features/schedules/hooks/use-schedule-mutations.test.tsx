import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClientWrapper, createTestQueryClient } from '@/test/query-client';

import { useAssignWorkSchedule, useCreateWorkSchedule, useUpdateWorkSchedule } from './use-schedule-mutations';

const servicesMock = vi.hoisted(() => ({
  createWorkSchedule: vi.fn(),
  updateWorkSchedule: vi.fn(),
  assignWorkSchedule: vi.fn(),
}));

vi.mock('@/shared/lib/service-registry', () => ({
  services: {
    workSchedules: {
      createWorkScheduleUseCase: { execute: servicesMock.createWorkSchedule },
      updateWorkScheduleUseCase: { execute: servicesMock.updateWorkSchedule },
      assignWorkScheduleToEmployeeUseCase: { execute: servicesMock.assignWorkSchedule },
    },
  },
}));

describe('schedule mutation hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cria escala e invalida dependências', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    servicesMock.createWorkSchedule.mockResolvedValue({ id: 'schedule-1' });

    const { result } = renderHook(() => useCreateWorkSchedule(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync({
      name: 'Administrativo',
      startTime: '08:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      endTime: '17:00',
      toleranceMinutes: 5,
      expectedDailyMinutes: 480,
      isActive: true,
    });

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedules'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedules', 'catalog'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['employees'] });
    });
  });

  it('atualiza escala e invalida dependências', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    servicesMock.updateWorkSchedule.mockResolvedValue({ id: 'schedule-2' });

    const { result } = renderHook(() => useUpdateWorkSchedule(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync({
      id: 'schedule-2',
      name: 'Noturno',
      startTime: '22:00',
      breakStartTime: '02:00',
      breakEndTime: '03:00',
      endTime: '06:00',
      toleranceMinutes: 10,
      expectedDailyMinutes: 420,
      isActive: true,
    });

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedules'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedules', 'catalog'] });
    });
  });

  it('atribui escala ao colaborador e invalida dependências', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    servicesMock.assignWorkSchedule.mockResolvedValue({ id: 'history-1' });

    const { result } = renderHook(() => useAssignWorkSchedule(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync({
      employeeId: 'employee-1',
      workScheduleId: 'schedule-1',
      startDate: '2026-04-01',
      endDate: null,
    });

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedules'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedules', 'catalog'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['employees'] });
    });
  });
});
