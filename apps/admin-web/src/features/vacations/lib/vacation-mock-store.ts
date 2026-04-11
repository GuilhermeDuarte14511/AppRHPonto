import type { CreateVacationRequestPayload, VacationRequest, VacationRequestStatus } from '../types/vacation-request';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const calculateTotalDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return Math.max(1, Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1);
};

let vacationRequests: VacationRequest[] = [
  {
    id: 'vac-2026-082',
    employeeId: 'emp-4',
    employeeName: 'Beatriz Santos',
    employeeEmail: 'beatriz.s@pontoprecise.com',
    department: 'Design e Produto',
    position: 'Product Designer Senior',
    requestedAt: '2026-04-02T11:20:00.000Z',
    startDate: '2026-08-15T00:00:00.000Z',
    endDate: '2026-08-29T00:00:00.000Z',
    totalDays: 15,
    availableDays: 22,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: false,
    cashBonus: false,
    status: 'pending',
    attachment: {
      fileName: 'termo-férias-beatriz.pdf',
      fileUrl: '#',
      signedBy: 'Gov.br',
    },
    coverageNotes: 'A equipe de design ja alinhou redistribuicao das entregas do ciclo Alpha.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Marcio Oliveira',
      timestamp: '2026-04-02T14:20:00.000Z',
      notes: 'Cobertura aprovada pelo gestor direto.',
    },
    hrApproval: {
      label: 'Pendente RH',
      status: 'pending',
      actor: 'Equipe de RH',
      timestamp: null,
      notes: 'Aguardando conferencia final de saldo e aceite.',
    },
    reviewNotes: null,
    createdAt: '2026-04-02T11:20:00.000Z',
    updatedAt: '2026-04-02T14:20:00.000Z',
  },
  {
    id: 'vac-2026-081',
    employeeId: 'emp-5',
    employeeName: 'Lucas Ferreira',
    employeeEmail: 'lucas.f@pontoprecise.com',
    department: 'Engenharia',
    position: 'Software Engineer',
    requestedAt: '2026-03-30T10:05:00.000Z',
    startDate: '2026-02-01T00:00:00.000Z',
    endDate: '2026-03-02T00:00:00.000Z',
    totalDays: 30,
    availableDays: 30,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: true,
    cashBonus: false,
    status: 'approved',
    attachment: {
      fileName: 'termo-férias-lucas.pdf',
      fileUrl: '#',
      signedBy: 'Gov.br',
    },
    coverageNotes: 'Time técnico redistribuiu plantões durante o período.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Patricia Rocha',
      timestamp: '2026-03-30T14:10:00.000Z',
      notes: 'Planejamento validado pela liderança técnica.',
    },
    hrApproval: {
      label: 'Aprovado pelo RH',
      status: 'completed',
      actor: 'Adriano Silva',
      timestamp: '2026-03-31T09:15:00.000Z',
      notes: 'Saldo conferido e documentos regulares.',
    },
    reviewNotes: 'Solicitação aprovada e comunicada ao colaborador.',
    createdAt: '2026-03-30T10:05:00.000Z',
    updatedAt: '2026-03-31T09:15:00.000Z',
  },
  {
    id: 'vac-2026-080',
    employeeId: 'emp-7',
    employeeName: 'Ricardo Almeida',
    employeeEmail: 'ricardo.a@pontoprecise.com',
    department: 'Financeiro',
    position: 'Analista Financeiro',
    requestedAt: '2026-03-20T13:50:00.000Z',
    startDate: '2026-12-20T00:00:00.000Z',
    endDate: '2027-01-04T00:00:00.000Z',
    totalDays: 16,
    availableDays: 18,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: false,
    cashBonus: false,
    status: 'rejected',
    attachment: null,
    coverageNotes: 'Fechamento anual do financeiro sem substituicao formal definida.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Luciana Prado',
      timestamp: '2026-03-21T09:30:00.000Z',
      notes: 'Gestora aprovou condicionada a cobertura do fechamento.',
    },
    hrApproval: {
      label: 'Reprovado pelo RH',
      status: 'completed',
      actor: 'Adriano Silva',
      timestamp: '2026-03-21T17:40:00.000Z',
      notes: 'Período conflita com o fechamento anual da área.',
    },
    reviewNotes: 'Solicitação reprovada por indisponibilidade operacional no período.',
    createdAt: '2026-03-20T13:50:00.000Z',
    updatedAt: '2026-03-21T17:40:00.000Z',
  },
  {
    id: 'vac-2026-079',
    employeeId: 'emp-8',
    employeeName: 'Fernanda Lima',
    employeeEmail: 'fernanda.l@pontoprecise.com',
    department: 'Atendimento',
    position: 'Analista de Atendimento',
    requestedAt: '2026-04-01T16:15:00.000Z',
    startDate: '2026-07-10T00:00:00.000Z',
    endDate: '2026-07-20T00:00:00.000Z',
    totalDays: 11,
    availableDays: 20,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: false,
    cashBonus: false,
    status: 'pending',
    attachment: {
      fileName: 'aceite-férias-fernanda.pdf',
      fileUrl: '#',
      signedBy: 'Clicksign',
    },
    coverageNotes: 'Supervisor solicitou reforco de escala antes da aprovação final.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Marcela Dias',
      timestamp: '2026-04-01T18:05:00.000Z',
      notes: 'Equipe de atendimento alinhada para cobertura parcial.',
    },
    hrApproval: {
      label: 'Pendente RH',
      status: 'pending',
      actor: 'Equipe de RH',
      timestamp: null,
      notes: 'Aguardando validação do aceite e da cobertura operacional.',
    },
    reviewNotes: null,
    createdAt: '2026-04-01T16:15:00.000Z',
    updatedAt: '2026-04-01T18:05:00.000Z',
  },
  {
    id: 'vac-2026-078',
    employeeId: 'emp-1',
    employeeName: 'Joao Pereira',
    employeeEmail: 'joao.p@pontoprecise.com',
    department: 'Recursos Humanos',
    position: 'Analista de Pessoas',
    requestedAt: '2026-03-10T09:00:00.000Z',
    startDate: '2026-04-01T00:00:00.000Z',
    endDate: '2026-04-10T00:00:00.000Z',
    totalDays: 10,
    availableDays: 18,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: false,
    cashBonus: false,
    status: 'approved',
    attachment: {
      fileName: 'aceite-férias-joao.pdf',
      fileUrl: '#',
      signedBy: 'Clicksign',
    },
    coverageNotes: 'Analista suplente alocado para atender rotina de admissão no período.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Carla Menezes',
      timestamp: '2026-03-10T14:00:00.000Z',
      notes: 'Cobertura da equipe confirmada.',
    },
    hrApproval: {
      label: 'Aprovado pelo RH',
      status: 'completed',
      actor: 'Adriano Silva',
      timestamp: '2026-03-11T10:40:00.000Z',
      notes: 'Saldo e aceite validados.',
    },
    reviewNotes: 'Férias em andamento na data atual de teste.',
    createdAt: '2026-03-10T09:00:00.000Z',
    updatedAt: '2026-03-11T10:40:00.000Z',
  },
  {
    id: 'vac-2026-077',
    employeeId: 'emp-2',
    employeeName: 'Ana Ribeiro',
    employeeEmail: 'ana.r@pontoprecise.com',
    department: 'Comercial',
    position: 'Executiva de contas',
    requestedAt: '2026-03-28T08:30:00.000Z',
    startDate: '2026-05-05T00:00:00.000Z',
    endDate: '2026-05-19T00:00:00.000Z',
    totalDays: 15,
    availableDays: 17,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: true,
    cashBonus: false,
    status: 'pending',
    attachment: {
      fileName: 'termo-férias-ana.pdf',
      fileUrl: '#',
      signedBy: 'Gov.br',
    },
    coverageNotes: 'Carteira de clientes redistribuida entre duas contas-chave.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Vinicius Prado',
      timestamp: '2026-03-28T15:10:00.000Z',
      notes: 'Redistribuicao comercial aprovada.',
    },
    hrApproval: {
      label: 'Pendente RH',
      status: 'pending',
      actor: 'Equipe de RH',
      timestamp: null,
      notes: 'Aguardando consolidação do adiantamento do 13o.',
    },
    reviewNotes: null,
    createdAt: '2026-03-28T08:30:00.000Z',
    updatedAt: '2026-03-28T15:10:00.000Z',
  },
  {
    id: 'vac-2026-076',
    employeeId: 'emp-6',
    employeeName: 'Juliana Costa',
    employeeEmail: 'juliana.c@pontoprecise.com',
    department: 'Operações',
    position: 'Coordenadora de turno',
    requestedAt: '2026-02-18T13:10:00.000Z',
    startDate: '2026-06-01T00:00:00.000Z',
    endDate: '2026-06-20T00:00:00.000Z',
    totalDays: 20,
    availableDays: 24,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: false,
    cashBonus: true,
    status: 'approved',
    attachment: {
      fileName: 'termo-férias-juliana.pdf',
      fileUrl: '#',
      signedBy: 'Clicksign',
    },
    coverageNotes: 'Plano de cobertura do kiosk e da recepcao noturna documentado.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Roberto Teles',
      timestamp: '2026-02-18T17:30:00.000Z',
      notes: 'Turnos redistribuidos para a equipe B.',
    },
    hrApproval: {
      label: 'Aprovado pelo RH',
      status: 'completed',
      actor: 'Adriano Silva',
      timestamp: '2026-02-19T09:25:00.000Z',
      notes: 'Solicitação aprovada com abono parcial.',
    },
    reviewNotes: 'Gozo aprovado com venda parcial de 10 dias.',
    createdAt: '2026-02-18T13:10:00.000Z',
    updatedAt: '2026-02-19T09:25:00.000Z',
  },
  {
    id: 'vac-2026-075',
    employeeId: 'emp-3',
    employeeName: 'Carlos Mendes',
    employeeEmail: 'carlos.m@pontoprecise.com',
    department: 'Logistica',
    position: 'Supervisor de patio',
    requestedAt: '2026-03-05T11:45:00.000Z',
    startDate: '2026-04-25T00:00:00.000Z',
    endDate: '2026-05-09T00:00:00.000Z',
    totalDays: 15,
    availableDays: 12,
    accrualPeriod: '2024/2025',
    advanceThirteenthSalary: false,
    cashBonus: false,
    status: 'rejected',
    attachment: null,
    coverageNotes: 'Saldo insuficiente e divergência no período aquisitivo do colaborador.',
    managerApproval: {
      label: 'Aprovado pela liderança',
      status: 'completed',
      actor: 'Denise Moura',
      timestamp: '2026-03-05T16:00:00.000Z',
      notes: 'Liderança aprovou condicionalmente ao saldo.',
    },
    hrApproval: {
      label: 'Reprovado pelo RH',
      status: 'completed',
      actor: 'Adriano Silva',
      timestamp: '2026-03-06T09:40:00.000Z',
      notes: 'Saldo disponível menor do que o período solicitado.',
    },
    reviewNotes: 'Reprovada por insuficiencia de saldo.',
    createdAt: '2026-03-05T11:45:00.000Z',
    updatedAt: '2026-03-06T09:40:00.000Z',
  },
];

export const listVacationRequests = async (): Promise<VacationRequest[]> => vacationRequests;

export const getVacationRequestById = async (id: string): Promise<VacationRequest | null> =>
  vacationRequests.find((item) => item.id === id) ?? null;

export const createVacationRequest = async (payload: CreateVacationRequestPayload): Promise<VacationRequest> => {
  const totalDays = calculateTotalDays(payload.startDate, payload.endDate);
  const timestamp = new Date().toISOString();
  const nextId = `vac-2026-${String(vacationRequests.length + 83).padStart(3, '0')}`;

  const request: VacationRequest = {
    id: nextId,
    employeeId: payload.employeeId,
    employeeName: payload.employeeName,
    employeeEmail: payload.employeeEmail,
    department: payload.department,
    position: payload.position,
    requestedAt: timestamp,
    startDate: payload.startDate,
    endDate: payload.endDate,
    totalDays,
    availableDays: 30,
    accrualPeriod: '2025/2026',
    advanceThirteenthSalary: payload.advanceThirteenthSalary,
    cashBonus: false,
    status: 'pending',
    attachment: payload.attachmentName
      ? {
          fileName: payload.attachmentName,
          fileUrl: '#',
          signedBy: 'Upload manual',
        }
      : null,
    coverageNotes: 'Solicitação criada no fluxo de testes do MVP.',
    managerApproval: {
      label: 'Pendente de liderança',
      status: 'pending',
      actor: 'Gestor imédiato',
      timestamp: null,
      notes: 'Aguardando aprovação inicial da liderança.',
    },
    hrApproval: {
      label: 'Pendente RH',
      status: 'pending',
      actor: 'Equipe de RH',
      timestamp: null,
      notes: 'Sera analisado após liberação da liderança.',
    },
    reviewNotes: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  vacationRequests = [request, ...vacationRequests];

  return request;
};

export const reviewVacationRequest = async (
  id: string,
  status: VacationRequestStatus,
  notes: string,
): Promise<VacationRequest> => {
  const request = vacationRequests.find((item) => item.id === id);

  if (!request) {
    throw new Error('Solicitação de férias não encontrada.');
  }

  const timestamp = new Date().toISOString();
  const updatedRequest: VacationRequest = {
    ...request,
    status,
    reviewNotes: notes,
    hrApproval: {
      label: status === 'approved' ? 'Aprovado pelo RH' : 'Reprovado pelo RH',
      status: 'completed',
      actor: 'Adriano Silva',
      timestamp,
      notes,
    },
    updatedAt: timestamp,
  };

  vacationRequests = vacationRequests.map((item) => (item.id === id ? updatedRequest : item));

  return updatedRequest;
};
