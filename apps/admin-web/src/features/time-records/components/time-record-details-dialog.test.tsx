import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TimeRecordDetailsDialog } from './time-record-details-dialog';
import type { TimeRecordListItem } from './time-record-list-item';

vi.mock('@/features/employees/hooks/use-employee-attendance-policy', () => ({
  useEmployeeAttendancePolicy: () => ({
    data: {
      employeeId: 'employee-1',
      employeeName: 'Ana Souza',
      registrationNumber: '1001',
      inheritedFromDefault: false,
      defaultAttendancePolicyId: 'policy-1',
      defaultAttendancePolicyName: 'Híbrido',
      policyCatalog: [
        {
          id: 'policy-1',
          code: 'HYB',
          name: 'Híbrido',
          mode: 'hybrid',
          validationStrategy: 'block',
          geolocationRequired: true,
          photoRequired: false,
          allowOffsiteClocking: false,
          requiresAllowedLocations: true,
          description: 'Exige local autorizado.',
          isActive: true,
        },
      ],
      locationCatalog: [
        {
          id: 'location-1',
          code: 'MAT',
          name: 'Matriz Paulista',
          type: 'company',
          city: 'São Paulo',
          state: 'SP',
          latitude: -23.55052,
          longitude: -46.633308,
          radiusMeters: 150,
          isActive: true,
        },
      ],
      assignment: {
        assignmentId: 'assignment-1',
        attendancePolicyId: 'policy-1',
        mode: 'hybrid',
        validationStrategy: 'block',
        geolocationRequired: true,
        photoRequired: false,
        allowAnyLocation: false,
        blockOutsideAllowedLocations: true,
        notes: '',
        selectedLocations: [
          {
            id: 'location-1',
            locationRole: 'primary_company',
            isRequired: false,
          },
        ],
      },
    },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('@rh-ponto/ui', async () => {
  const React = await import('react');

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Button: ({
      children,
      onClick,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} type="button" {...props}>
        {children}
      </button>
    ),
    Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  };
});

const createRecord = (overrides: Partial<TimeRecordListItem> = {}): TimeRecordListItem => ({
  id: 'record-1',
  employeeId: 'employee-1',
  employeeName: 'Ana Souza',
  department: 'RH',
  deviceId: 'device-1',
  recordedByUserId: 'user-1',
  recordType: 'entry',
  source: 'employee_app',
  status: 'valid',
  recordedAt: '2026-04-19T11:00:00.000Z',
  originalRecordedAt: null,
  notes: 'Registro de teste',
  isManual: false,
  referenceRecordId: null,
  latitude: -23.55052,
  longitude: -46.633308,
  resolvedAddress: 'Av. Paulista, 1000 - São Paulo/SP',
  ipAddress: '127.0.0.1',
  createdAt: '2026-04-19T11:00:00.000Z',
  updatedAt: '2026-04-19T11:00:00.000Z',
  photos: [],
  ...overrides,
});

describe('TimeRecordDetailsDialog', () => {
  it('renderiza um mini mapa quando a marcação possui latitude e longitude', () => {
    render(
      <TimeRecordDetailsDialog
        deviceLabel="Totem recepção"
        onAdjust={vi.fn()}
        onOpenChange={vi.fn()}
        open
        record={createRecord()}
      />,
    );

    expect(screen.getByTitle('Mini mapa da marcação')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir no mapa' })).toBeInTheDocument();
    expect(screen.getByText('Dentro da área autorizada')).toBeInTheDocument();
  });
});
