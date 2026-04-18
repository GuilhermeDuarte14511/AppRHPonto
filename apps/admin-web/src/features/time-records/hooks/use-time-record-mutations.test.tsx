import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClientWrapper, createTestQueryClient } from '@/test/query-client';

import { useAdjustTimeRecord, useCreateTimeRecord } from './use-time-record-mutations';

vi.mock('@rh-ponto/api-client', () => ({
  queryKeys: {
    timeRecords: ['time-records'],
    timeRecordCatalog: ['time-records', 'catalog'],
    dashboard: ['dashboard'],
    audit: ['audit'],
    payroll: ['payroll'],
  },
}));

const servicesMock = vi.hoisted(() => ({
  createTimeRecord: vi.fn(),
  adjustTimeRecord: vi.fn(),
}));

vi.mock('@/shared/lib/service-registry', () => ({
  services: {
    timeRecords: {
      createTimeRecordUseCase: { execute: servicesMock.createTimeRecord },
      adjustTimeRecordUseCase: { execute: servicesMock.adjustTimeRecord },
    },
  },
}));

describe('time-record mutation hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cria marcação e invalida leituras derivadas', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    servicesMock.createTimeRecord.mockResolvedValue({ id: 'record-1' });

    const { result } = renderHook(() => useCreateTimeRecord(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync({
      employeeId: 'employee-1',
      deviceId: null,
      recordedByUserId: 'user-1',
      recordType: 'entry',
      source: 'admin_adjustment',
      status: 'valid',
      recordedAt: '2026-04-04T08:00:00.000Z',
      originalRecordedAt: null,
      notes: 'Inclusão manual',
      isManual: true,
      referenceRecordId: null,
      latitude: null,
      longitude: null,
      ipAddress: null,
    });

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['time-records'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['time-records', 'catalog'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['audit'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['payroll'] });
    });
  });

  it('ajusta marcação, atualiza o cache local e invalida leituras derivadas', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    queryClient.setQueryData(['time-records'], [
      {
        id: 'record-2',
        employeeId: 'employee-2',
        employeeName: 'Ana Paula',
        department: 'Financeiro',
        deviceId: 'device-1',
        recordedByUserId: 'user-1',
        recordType: 'entry',
        source: 'employee_app',
        status: 'pending_review',
        recordedAt: '2026-04-04T08:00:00.000Z',
        originalRecordedAt: '2026-04-04T08:00:00.000Z',
        notes: 'Horário original',
        isManual: false,
        referenceRecordId: null,
        latitude: null,
        longitude: null,
        resolvedAddress: null,
        ipAddress: null,
        createdAt: '2026-04-04T08:00:00.000Z',
        updatedAt: '2026-04-04T08:00:00.000Z',
        photos: [],
      },
    ]);

    servicesMock.adjustTimeRecord.mockResolvedValue({
      id: 'record-2',
      employeeId: 'employee-2',
      deviceId: 'device-1',
      recordedByUserId: 'user-1',
      recordType: 'entry',
      source: 'admin_adjustment',
      status: 'adjusted',
      recordedAt: '2026-04-04T09:10:00.000Z',
      originalRecordedAt: '2026-04-04T08:00:00.000Z',
      notes: 'Ajuste de horário',
      isManual: true,
      referenceRecordId: null,
      latitude: null,
      longitude: null,
      resolvedAddress: null,
      ipAddress: null,
      createdAt: '2026-04-04T08:00:00.000Z',
      updatedAt: '2026-04-04T09:10:00.000Z',
    });

    const { result } = renderHook(() => useAdjustTimeRecord(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync({
      timeRecordId: 'record-2',
      recordedAt: '2026-04-04T09:10:00.000Z',
      notes: 'Ajuste de horário',
    });

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['time-records'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['time-records', 'catalog'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['audit'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['payroll'] });
    });

    expect(queryClient.getQueryData(['time-records'])).toEqual([
      expect.objectContaining({
        id: 'record-2',
        source: 'admin_adjustment',
        status: 'adjusted',
        recordedAt: '2026-04-04T09:10:00.000Z',
        notes: 'Ajuste de horário',
        employeeName: 'Ana Paula',
        department: 'Financeiro',
        photos: [],
      }),
    ]);
  });
});
