import type { Employee } from '../../domain/entities/employee';
import type {
  CreateEmployeePayload,
  EmployeeListFilters,
  EmployeeRepository,
  UpdateEmployeePayload,
} from '../../domain/repositories/employee-repository';

const employeesSeed: Employee[] = [
  {
    id: 'emp-1',
    userId: 'user-employee-1',
    registrationNumber: '1001',
    fullName: 'João Pereira',
    cpf: '12345678901',
    email: 'joao@empresa.com',
    phone: '11999990001',
    birthDate: '1991-04-10',
    hireDate: '2023-01-16',
    departmentId: 'dep-ops',
    department: 'Operações',
    position: 'Analista de Campo',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    pinCode: '1234',
    isActive: true,
    createdAt: '2024-01-12T08:00:00.000Z',
    updatedAt: '2025-03-10T08:00:00.000Z',
  },
  {
    id: 'emp-2',
    userId: null,
    registrationNumber: '1002',
    fullName: 'Ana Ribeiro',
    cpf: '98765432100',
    email: 'ana@empresa.com',
    phone: '11999990002',
    birthDate: '1988-11-20',
    hireDate: '2022-09-01',
    departmentId: 'dep-fin',
    department: 'Financeiro',
    position: 'Assistente Financeira',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    pinCode: '4321',
    isActive: true,
    createdAt: '2024-01-12T08:00:00.000Z',
    updatedAt: '2025-03-10T08:00:00.000Z',
  },
  {
    id: 'emp-3',
    userId: null,
    registrationNumber: '1003',
    fullName: 'Carlos Mendes',
    cpf: '11122233344',
    email: 'carlos@empresa.com',
    phone: '11999990003',
    birthDate: '1994-08-02',
    hireDate: '2024-02-14',
    departmentId: 'dep-log',
    department: 'Logística',
    position: 'Supervisor',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    pinCode: '8765',
    isActive: false,
    createdAt: '2024-02-14T08:00:00.000Z',
    updatedAt: '2025-02-01T08:00:00.000Z',
  },
  {
    id: 'emp-4',
    userId: null,
    registrationNumber: '1004',
    fullName: 'Beatriz Santos',
    cpf: '55566677788',
    email: 'beatriz.santos@empresa.com',
    phone: '11999990004',
    birthDate: '1992-01-18',
    hireDate: '2025-01-06',
    departmentId: 'dep-rh',
    department: 'Recursos Humanos',
    position: 'Business Partner',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    pinCode: '2468',
    isActive: true,
    createdAt: '2025-01-06T09:00:00.000Z',
    updatedAt: '2026-04-02T09:00:00.000Z',
  },
  {
    id: 'emp-5',
    userId: null,
    registrationNumber: '1005',
    fullName: 'Lucas Ferreira',
    cpf: '44455566677',
    email: 'lucas.ferreira@empresa.com',
    phone: '11999990005',
    birthDate: '1996-06-27',
    hireDate: '2026-02-10',
    departmentId: 'dep-eng',
    department: 'Engenharia',
    position: 'Desenvolvedor Pleno',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    pinCode: '1357',
    isActive: true,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-04-01T08:45:00.000Z',
  },
  {
    id: 'emp-6',
    userId: null,
    registrationNumber: '1006',
    fullName: 'Juliana Costa',
    cpf: '33344455566',
    email: 'juliana.costa@empresa.com',
    phone: '11999990006',
    birthDate: '1990-09-09',
    hireDate: '2023-08-21',
    departmentId: 'dep-mkt',
    department: 'Marketing',
    position: 'Coordenadora de Conteúdo',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
    pinCode: '9753',
    isActive: true,
    createdAt: '2023-08-21T08:00:00.000Z',
    updatedAt: '2026-04-02T13:10:00.000Z',
  },
  {
    id: 'emp-7',
    userId: null,
    registrationNumber: '1007',
    fullName: 'Ricardo Almeida',
    cpf: '22233344455',
    email: 'ricardo.almeida@empresa.com',
    phone: '11999990007',
    birthDate: '1987-03-12',
    hireDate: '2021-11-03',
    departmentId: 'dep-com',
    department: 'Comercial',
    position: 'Executivo de Contas',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    pinCode: '8642',
    isActive: true,
    createdAt: '2021-11-03T08:00:00.000Z',
    updatedAt: '2026-04-03T09:20:00.000Z',
  },
  {
    id: 'emp-8',
    userId: null,
    registrationNumber: '1008',
    fullName: 'Fernanda Lima',
    cpf: '11133355577',
    email: 'fernanda.lima@empresa.com',
    phone: '11999990008',
    birthDate: '1995-12-05',
    hireDate: '2024-10-01',
    departmentId: 'dep-ate',
    department: 'Atendimento',
    position: 'Supervisora de Relacionamento',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    pinCode: '6428',
    isActive: true,
    createdAt: '2024-10-01T09:00:00.000Z',
    updatedAt: '2026-04-02T16:12:00.000Z',
  },
];

let employees = [...employeesSeed];

export class MockEmployeesRepository implements EmployeeRepository {
  async list(filters?: EmployeeListFilters): Promise<Employee[]> {
    return employees.filter((employee) => {
      const matchesSearch = filters?.search
        ? [employee.fullName, employee.registrationNumber, employee.department]
            .join(' ')
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        : true;
      const matchesStatus =
        typeof filters?.isActive === 'boolean' ? employee.isActive === filters.isActive : true;

      return matchesSearch && matchesStatus;
    });
  }

  async getById(id: string): Promise<Employee | null> {
    return employees.find((employee) => employee.id === id) ?? null;
  }

  async create(payload: CreateEmployeePayload): Promise<Employee> {
    const timestamp = new Date().toISOString();
    const employee: Employee = {
      id: `emp-${employees.length + 1}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      userId: payload.userId ?? null,
      cpf: payload.cpf ?? null,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      birthDate: payload.birthDate ?? null,
      hireDate: payload.hireDate ?? null,
      departmentId: payload.departmentId ?? null,
      department: null,
      position: payload.position ?? null,
      profilePhotoUrl: payload.profilePhotoUrl ?? null,
      pinCode: payload.pinCode ?? null,
      ...payload,
    };

    employees = [employee, ...employees];

    return employee;
  }

  async update(payload: UpdateEmployeePayload): Promise<Employee> {
    const existing = employees.find((employee) => employee.id === payload.id);

    if (!existing) {
      throw new Error('Employee not found.');
    }

    const updated: Employee = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    employees = employees.map((employee) => (employee.id === updated.id ? updated : employee));

    return updated;
  }

  async deactivate(id: string): Promise<void> {
    employees = employees.map((employee) =>
      employee.id === id
        ? {
            ...employee,
            isActive: false,
            updatedAt: new Date().toISOString(),
          }
        : employee,
    );
  }
}
