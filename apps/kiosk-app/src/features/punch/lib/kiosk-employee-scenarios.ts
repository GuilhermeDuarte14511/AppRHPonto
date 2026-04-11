export interface KioskEmployeeScenario {
  employeeId: string;
  name: string;
  registrationNumber: string;
  department: string;
  roleLabel: string;
}

export const kioskEmployeeScenarios: KioskEmployeeScenario[] = [
  {
    employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    name: 'João Pereira',
    registrationNumber: '1024',
    department: 'Operações',
    roleLabel: 'Analista de operações',
  },
  {
    employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    name: 'Beatriz Santos',
    registrationNumber: '2081',
    department: 'Produto',
    roleLabel: 'Product designer',
  },
  {
    employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
    name: 'Lucas Ferreira',
    registrationNumber: '3102',
    department: 'Tecnologia',
    roleLabel: 'Desenvolvedor full stack',
  },
  {
    employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa7',
    name: 'Ricardo Almeida',
    registrationNumber: '4560',
    department: 'Comercial',
    roleLabel: 'Executivo de contas',
  },
  {
    employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa12',
    name: 'Diego Barros',
    registrationNumber: '5522',
    department: 'Operações externas',
    roleLabel: 'Supervisor de campo',
  },
];
