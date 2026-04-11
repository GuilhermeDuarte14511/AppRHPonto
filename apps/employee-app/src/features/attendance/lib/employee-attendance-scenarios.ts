export interface EmployeeRecentRecord {
  id: string;
  label: string;
  typeLabel: string;
  statusLabel: string;
  sourceLabel: string;
  notes: string;
}

export interface EmployeeAttendanceScenario {
  employeeId: string;
  name: string;
  registrationNumber: string;
  department: string;
  roleLabel: string;
  recentRecords: EmployeeRecentRecord[];
}

const scenariosByEmail: Record<string, EmployeeAttendanceScenario> = {
  'employee@empresa.com': {
    employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    name: 'João Pereira',
    registrationNumber: '1024',
    department: 'Operações',
    roleLabel: 'Analista de operações',
    recentRecords: [
      {
        id: 'employee-record-1',
        label: '10/04 · Entrada 08:03',
        typeLabel: 'Entrada',
        statusLabel: 'Válido',
        sourceLabel: 'App do funcionário',
        notes: 'Registro feito dentro da geofence da matriz.',
      },
      {
        id: 'employee-record-2',
        label: '09/04 · Início do intervalo 12:01',
        typeLabel: 'Início do intervalo',
        statusLabel: 'Válido',
        sourceLabel: 'Kiosk da empresa',
        notes: 'Fluxo regular sem divergência operacional.',
      },
      {
        id: 'employee-record-3',
        label: '08/04 · Entrada 08:19',
        typeLabel: 'Entrada',
        statusLabel: 'Em revisão',
        sourceLabel: 'App do funcionário',
        notes: 'Tentativa registrada fora da janela padrão de deslocamento.',
      },
    ],
  },
};

export const resolveEmployeeAttendanceScenario = (email?: string | null): EmployeeAttendanceScenario | null => {
  if (!email) {
    return null;
  }

  return scenariosByEmail[email] ?? null;
};
