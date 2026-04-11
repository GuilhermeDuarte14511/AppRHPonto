import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClientWrapper, createTestQueryClient } from '@/test/query-client';

import { useCreateEmployee } from './use-create-employee';
import { useDeactivateEmployee } from './use-deactivate-employee';
import { useUpdateEmployee } from './use-update-employee';

const servicesMock = vi.hoisted(() => ({
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deactivateEmployee: vi.fn(),
}));

vi.mock('@/shared/lib/service-registry', () => ({
  services: {
    employees: {
      createEmployeeUseCase: { execute: servicesMock.createEmployee },
      updateEmployeeUseCase: { execute: servicesMock.updateEmployee },
      deactivateEmployeeUseCase: { execute: servicesMock.deactivateEmployee },
    },
  },
}));

describe('employee mutation hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cria funcionário e invalida a listagem', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    servicesMock.createEmployee.mockResolvedValue({ id: 'employee-1' });

    const { result } = renderHook(() => useCreateEmployee(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync({
      registrationNumber: '1234',
      fullName: 'Ana Paula Mendes',
      cpf: '12345678901',
      email: 'ana@empresa.com',
      phone: '11999999999',
      birthDate: '1990-01-01',
      hireDate: '2024-01-01',
      departmentId: 'dep-produto',
      position: 'Analista',
      pinCode: '1234',
      isActive: true,
    });

    expect(servicesMock.createEmployee).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['employees'] });
    });
  });

  it('atualiza funcionário e invalida detalhe, dashboard e listagem', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    servicesMock.updateEmployee.mockResolvedValue({ id: 'employee-2' });

    const { result } = renderHook(() => useUpdateEmployee(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync({
      id: 'employee-2',
      registrationNumber: '5678',
      fullName: 'Carlos Eduardo',
      cpf: '98765432100',
      email: 'carlos@empresa.com',
      phone: '11888888888',
      birthDate: '1988-02-02',
      hireDate: '2023-02-02',
      departmentId: 'dep-tecnologia',
      position: 'Desenvolvedor',
      pinCode: '5678',
      isActive: true,
    });

    expect(servicesMock.updateEmployee).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['employees'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['employees', 'employee-2'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
    });
  });

  it('desativa funcionário e invalida as áreas dependentes', async () => {
    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    servicesMock.deactivateEmployee.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeactivateEmployee(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await result.current.mutateAsync('employee-3');

    expect(servicesMock.deactivateEmployee).toHaveBeenCalledWith('employee-3');
    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['employees'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['employees', 'employee-3'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedules'] });
    });
  });
});
