import { AppError, formatDate, formatDateTime } from '@rh-ponto/core';
import type {
  OnboardingTaskCreateSchema,
  OnboardingTaskStatusSchema,
} from '@rh-ponto/validations';

import { formatPhoneCompact, formatRegistrationNumber } from '@/shared/lib/admin-formatters';
import { executeAdminGraphql } from '@/shared/lib/admin-server-data-connect';

import type {
  OnboardingAttentionData,
  EmployeeOnboardingSnapshot,
  OnboardingCategorySummary,
  OnboardingCategorySummaryStatus,
  OnboardingDetailTask,
  OnboardingJourneyDetailData,
  OnboardingJourneyStatus,
  OnboardingOverviewData,
  OnboardingOverviewItem,
  OnboardingTaskCategory,
  OnboardingTaskSection,
  OnboardingTaskStatus,
} from './onboarding-contracts';
import {
  onboardingCategoryLabelMap,
  onboardingJourneyStatusLabelMap,
  onboardingTaskStatusLabelMap,
} from './onboarding-formatters';

interface OnboardingOverviewQueryData {
  onboardingJourneys: Array<{
    id: string;
    status: OnboardingJourneyStatus;
    startDate: string;
    expectedEndDate?: string | null;
    completedAt?: string | null;
    progressPercent: number;
    currentStageLabel?: string | null;
    notes?: string | null;
    employee: {
      id: string;
      fullName: string;
      email?: string | null;
      position?: string | null;
      department?: { name: string } | null;
    };
    ownerUser?: {
      id: string;
      name: string;
    } | null;
  }>;
  onboardingTasks: Array<{
    id: string;
    category: OnboardingTaskCategory;
    status: OnboardingTaskStatus;
    dueDate?: string | null;
    completedAt?: string | null;
    blockerReason?: string | null;
    journey: { id: string };
  }>;
}

interface OnboardingDetailQueryData {
  onboardingJourneys: Array<{
    id: string;
    status: OnboardingJourneyStatus;
    startDate: string;
    expectedEndDate?: string | null;
    completedAt?: string | null;
    progressPercent: number;
    currentStageLabel?: string | null;
    notes?: string | null;
    employee: {
      id: string;
      fullName: string;
      email?: string | null;
      phone?: string | null;
      position?: string | null;
      registrationNumber: string;
      hireDate?: string | null;
      department?: { name: string } | null;
    };
    ownerUser?: {
      id: string;
      name: string;
      email?: string | null;
    } | null;
  }>;
  onboardingTasks: Array<{
    id: string;
    category: OnboardingTaskCategory;
    title: string;
    description?: string | null;
    status: OnboardingTaskStatus;
    dueDate?: string | null;
    completedAt?: string | null;
    assignedUser?: { id: string; name: string; email?: string | null } | null;
    isRequired: boolean;
    sortOrder: number;
    blockerReason?: string | null;
    evidenceFileName?: string | null;
    evidenceFileUrl?: string | null;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

interface OnboardingMutationData {
  onboardingJourney_insert?: { id: string } | null;
  onboardingJourney_update?: { id: string } | null;
  onboardingTask_insert?: { id: string } | null;
  onboardingTask_update?: { id: string } | null;
  auditLog_insert?: { id: string } | null;
}

interface EmployeeOnboardingSummaryQueryData {
  onboardingJourneys: Array<{
    id: string;
    status: OnboardingJourneyStatus;
    progressPercent: number;
    currentStageLabel?: string | null;
  }>;
}

interface EmployeeForOnboardingQueryData {
  employees: Array<{
    id: string;
    fullName: string;
    hireDate?: string | null;
  }>;
}

interface OnboardingAttentionQueryData {
  onboardingTasks: Array<{
    id: string;
    title: string;
    status: OnboardingTaskStatus;
    dueDate?: string | null;
    updatedAt: string;
    journey: {
      id: string;
      employee: {
        fullName: string;
      };
    };
  }>;
}

const onboardingOverviewQuery = `
  query GetOnboardingOverview {
    onboardingJourneys(orderBy: [{ createdAt: DESC }], limit: 120) {
      id
      status
      startDate
      expectedEndDate
      completedAt
      progressPercent
      currentStageLabel
      notes
      employee {
        id
        fullName
        email
        position
        department {
          name
        }
      }
      ownerUser {
        id
        name
      }
    }
    onboardingTasks(orderBy: [{ sortOrder: ASC }, { createdAt: ASC }], limit: 1000) {
      id
      category
      status
      dueDate
      completedAt
      blockerReason
      journey {
        id
      }
    }
  }
`;

const employeeOnboardingSummaryQuery = `
  query GetEmployeeOnboardingSummary($employeeId: UUID!) {
    onboardingJourneys(where: { employeeId: { eq: $employeeId } }, orderBy: [{ createdAt: DESC }], limit: 1) {
      id
      status
      progressPercent
      currentStageLabel
    }
  }
`;

const employeeForOnboardingQuery = `
  query GetEmployeeForOnboarding($employeeId: UUID!) {
    employees(where: { id: { eq: $employeeId } }, limit: 1) {
      id
      fullName
      hireDate
    }
  }
`;

const onboardingDetailQuery = `
  query GetOnboardingJourneyDetail($journeyId: UUID!) {
    onboardingJourneys(where: { id: { eq: $journeyId } }, limit: 1) {
      id
      status
      startDate
      expectedEndDate
      completedAt
      progressPercent
      currentStageLabel
      notes
      employee {
        id
        fullName
        email
        phone
        position
        registrationNumber
        hireDate
        department {
          name
        }
      }
      ownerUser {
        id
        name
        email
      }
    }
    onboardingTasks(
      where: { journeyId: { eq: $journeyId } }
      orderBy: [{ category: ASC }, { sortOrder: ASC }, { createdAt: ASC }]
      limit: 200
    ) {
      id
      category
      title
      description
      status
      dueDate
      completedAt
      assignedUser {
        id
        name
        email
      }
      isRequired
      sortOrder
      blockerReason
      evidenceFileName
      evidenceFileUrl
    }
    users(where: { role: { eq: "admin" }, isActive: { eq: true } }, orderBy: [{ name: ASC }], limit: 50) {
      id
      name
      email
    }
  }
`;

const onboardingAttentionQuery = `
  query GetOnboardingAttention {
    onboardingTasks(
      where: { status: { in: ["blocked", "pending", "in_progress"] } }
      orderBy: [{ updatedAt: DESC }, { createdAt: DESC }]
    ) {
      id
      title
      status
      dueDate
      updatedAt
      journey {
        id
        employee {
          fullName
        }
      }
    }
  }
`;

const createOnboardingTaskMutation = `
  mutation CreateOnboardingTask(
    $journeyId: UUID!
    $title: String!
    $category: String!
    $description: String
    $dueDate: Date
    $isRequired: Boolean!
    $sortOrder: Int!
  ) {
    onboardingTask_insert(
      data: {
        journey: { id: $journeyId }
        title: $title
        category: $category
        description: $description
        status: "pending"
        dueDate: $dueDate
        isRequired: $isRequired
        sortOrder: $sortOrder
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const createOnboardingJourneyMutation = `
  mutation CreateOnboardingJourney(
    $employeeId: UUID!
    $ownerUserId: UUID!
    $status: String!
    $startDate: Date!
    $expectedEndDate: Date!
    $currentStageLabel: String!
    $notes: String
  ) {
    onboardingJourney_insert(
      data: {
        employee: { id: $employeeId }
        ownerUser: { id: $ownerUserId }
        status: $status
        startDate: $startDate
        expectedEndDate: $expectedEndDate
        progressPercent: 0
        currentStageLabel: $currentStageLabel
        notes: $notes
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const createOnboardingTaskWithAssigneeMutation = `
  mutation CreateOnboardingTaskWithAssignee(
    $journeyId: UUID!
    $title: String!
    $category: String!
    $description: String
    $dueDate: Date
    $isRequired: Boolean!
    $sortOrder: Int!
    $assignedUserId: UUID!
  ) {
    onboardingTask_insert(
      data: {
        journey: { id: $journeyId }
        title: $title
        category: $category
        description: $description
        status: "pending"
        dueDate: $dueDate
        isRequired: $isRequired
        sortOrder: $sortOrder
        assignedUser: { id: $assignedUserId }
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const updateOnboardingTaskMutation = `
  mutation UpdateOnboardingTaskStatus(
    $taskId: UUID!
    $status: String!
    $blockerReason: String
    $completedAt: Timestamp
  ) {
    onboardingTask_update(
      id: $taskId
      data: {
        status: $status
        blockerReason: $blockerReason
        completedAt: $completedAt
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const updateOnboardingJourneyMutation = `
  mutation UpdateOnboardingJourneySnapshot(
    $journeyId: UUID!
    $status: String!
    $progressPercent: Int!
    $currentStageLabel: String!
    $completedAt: Timestamp
  ) {
    onboardingJourney_update(
      id: $journeyId
      data: {
        status: $status
        progressPercent: $progressPercent
        currentStageLabel: $currentStageLabel
        completedAt: $completedAt
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const createOnboardingAuditLogMutation = `
  mutation CreateOnboardingAuditLog(
    $userId: UUID!
    $entityId: String!
    $action: String!
    $description: String!
  ) {
    auditLog_insert(
      data: {
        user: { id: $userId }
        entityName: "onboarding"
        entityId: $entityId
        action: $action
        description: $description
        createdAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const statusPriority: Record<OnboardingCategorySummaryStatus | OnboardingTaskStatus, number> = {
  blocked: 4,
  in_progress: 3,
  pending: 2,
  completed: 1,
  empty: 0,
};

const categoryDescriptions: Record<OnboardingTaskCategory, string> = {
  documentation: 'Documentos admissionais, contrato e dados cadastrais.',
  equipment: 'Equipamentos, entrega patrimonial e infraestrutura de trabalho.',
  signature: 'Assinaturas digitais, termos e aceite formal do colaborador.',
  access: 'Provisionamento de e-mail, sistemas internos e credenciais.',
  training: 'Treinamentos obrigatórios, cultura e ritos da área.',
  benefits: 'Inscrição em benefícios e parâmetros de folha.',
  culture: 'Integração com cultura, time e jornada inicial.',
};

const getCategoryStatus = (tasks: Array<{ status: OnboardingTaskStatus }>): OnboardingCategorySummaryStatus => {
  if (tasks.length === 0) {
    return 'empty';
  }

  return tasks.reduce<OnboardingCategorySummaryStatus>((current, task) => {
    if (statusPriority[task.status] > statusPriority[current]) {
      return task.status;
    }

    return current;
  }, 'completed');
};

const getProgressPercent = (
  tasks: Array<{ status: OnboardingTaskStatus; isRequired?: boolean }>,
  fallback: number,
) => {
  const requiredTasks = tasks.filter((task) => task.isRequired ?? true);

  if (requiredTasks.length === 0) {
    return fallback;
  }

  const completedTasks = requiredTasks.filter((task) => task.status === 'completed').length;
  return Math.round((completedTasks / requiredTasks.length) * 100);
};

const mapCategorySummary = (
  category: OnboardingTaskCategory,
  tasks: Array<{ status: OnboardingTaskStatus }>,
): OnboardingCategorySummary => ({
  category,
  label: onboardingCategoryLabelMap[category],
  status: getCategoryStatus(tasks),
  completedCount: tasks.filter((task) => task.status === 'completed').length,
  totalCount: tasks.length,
});

const nowTime = () => new Date().getTime();

const addDays = (baseDate: Date, amount: number) => {
  const nextDate = new Date(baseDate);
  nextDate.setUTCDate(nextDate.getUTCDate() + amount);

  return nextDate.toISOString().slice(0, 10);
};

const getStartDateBase = (hireDate?: string | null) => {
  if (hireDate) {
    return new Date(`${hireDate}T00:00:00.000Z`);
  }

  return new Date();
};

const onboardingDefaultTaskTemplates = (employeeName: string, startDate: Date) => [
  {
    title: 'Receber documentos admissionais',
    category: 'documentation' as const,
    description: `Validar CPF, documentos pessoais e dados cadastrais de ${employeeName}.`,
    dueDate: addDays(startDate, 1),
  },
  {
    title: 'Assinar contrato e termos',
    category: 'signature' as const,
    description: 'Concluir assinatura do contrato, termo de confidencialidade e políticas internas.',
    dueDate: addDays(startDate, 2),
  },
  {
    title: 'Provisionar acessos internos',
    category: 'access' as const,
    description: 'Liberar e-mail, sistemas, grupos e permissões necessários para a função.',
    dueDate: addDays(startDate, 3),
  },
  {
    title: 'Preparar equipamentos e patrimônio',
    category: 'equipment' as const,
    description: 'Separar notebook, periféricos e registrar o termo de responsabilidade.',
    dueDate: addDays(startDate, 4),
  },
  {
    title: 'Cadastrar benefícios e parâmetros de folha',
    category: 'benefits' as const,
    description: 'Conferir vale-transporte, benefícios flexíveis e parâmetros de fechamento.',
    dueDate: addDays(startDate, 5),
  },
  {
    title: 'Agendar treinamentos obrigatórios',
    category: 'training' as const,
    description: 'Planejar treinamentos iniciais, segurança da informação e ritos da área.',
    dueDate: addDays(startDate, 6),
  },
  {
    title: 'Realizar integração cultural com o time',
    category: 'culture' as const,
    description: 'Apresentar o time, cerimônias internas e expectativas para a primeira semana.',
    dueDate: addDays(startDate, 7),
  },
];

const isOverdue = (task: { dueDate?: string | null; status: OnboardingTaskStatus }) => {
  if (!task.dueDate || task.status === 'completed') {
    return false;
  }

  return new Date(`${task.dueDate}T23:59:59.999Z`).getTime() < nowTime();
};

const getJourneySnapshot = (
  tasks: Array<{
    id: string;
    title: string;
    status: OnboardingTaskStatus;
    isRequired: boolean;
  }>,
): {
  status: OnboardingJourneyStatus;
  progressPercent: number;
  currentStageLabel: string;
  completedAt: string | null;
} => {
  const requiredTasks = tasks.filter((task) => task.isRequired);
  const trackedTasks = requiredTasks.length > 0 ? requiredTasks : tasks;
  const completedCount = trackedTasks.filter((task) => task.status === 'completed').length;
  const progressPercent =
    trackedTasks.length > 0 ? Math.round((completedCount / trackedTasks.length) * 100) : 0;
  const blockedTask = trackedTasks.find((task) => task.status === 'blocked');
  const inProgressTask = trackedTasks.find((task) => task.status === 'in_progress');
  const pendingTask = trackedTasks.find((task) => task.status === 'pending');
  const allCompleted = trackedTasks.length > 0 && trackedTasks.every((task) => task.status === 'completed');
  const anyStarted = trackedTasks.some((task) => task.status === 'in_progress' || task.status === 'completed');

  if (allCompleted) {
    return {
      status: 'completed',
      progressPercent: 100,
      currentStageLabel: 'Concluído',
      completedAt: new Date().toISOString(),
    };
  }

  if (blockedTask) {
    return {
      status: 'blocked',
      progressPercent,
      currentStageLabel: blockedTask.title,
      completedAt: null,
    };
  }

  if (anyStarted) {
    return {
      status: 'in_progress',
      progressPercent,
      currentStageLabel: inProgressTask?.title ?? pendingTask?.title ?? 'Fluxo em andamento',
      completedAt: null,
    };
  }

  return {
    status: 'pending',
    progressPercent,
    currentStageLabel: pendingTask?.title ?? 'Fluxo inicial',
    completedAt: null,
  };
};

const toOverviewItem = (
  journey: OnboardingOverviewQueryData['onboardingJourneys'][number],
  tasks: OnboardingOverviewQueryData['onboardingTasks'],
): OnboardingOverviewItem => {
  const journeyTasks = tasks.filter((task) => task.journey.id === journey.id);
  const progressPercent = getProgressPercent(journeyTasks, journey.progressPercent);
  const overdueTasksCount = journeyTasks.filter((task) => isOverdue(task)).length;
  const categorySummaries = {
    documentation: mapCategorySummary(
      'documentation',
      journeyTasks.filter((task) => task.category === 'documentation'),
    ),
    equipment: mapCategorySummary(
      'equipment',
      journeyTasks.filter((task) => task.category === 'equipment'),
    ),
    signature: mapCategorySummary(
      'signature',
      journeyTasks.filter((task) => task.category === 'signature'),
    ),
  };

  return {
    id: journey.id,
    employeeId: journey.employee.id,
    employeeName: journey.employee.fullName,
    employeeEmail: journey.employee.email ?? null,
    department: journey.employee.department?.name ?? 'Sem departamento',
    position: journey.employee.position ?? 'Cargo não informado',
    ownerName: journey.ownerUser?.name ?? 'RH não atribuído',
    status: journey.status,
    statusLabel: onboardingJourneyStatusLabelMap[journey.status],
    progressPercent,
    currentStageLabel: journey.currentStageLabel ?? 'Fluxo inicial',
    startDateLabel: formatDate(journey.startDate),
    expectedEndDateLabel: journey.expectedEndDate ? formatDate(journey.expectedEndDate) : 'Sem previsão',
    overdueTasksCount,
    categorySummaries,
  };
};

const buildSections = (tasks: OnboardingDetailQueryData['onboardingTasks']): OnboardingTaskSection[] =>
  (Object.keys(onboardingCategoryLabelMap) as OnboardingTaskCategory[]).map((category) => {
    const categoryTasks = tasks.filter((task) => task.category === category);
    const detailTasks: OnboardingDetailTask[] = categoryTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      category: task.category,
      categoryLabel: onboardingCategoryLabelMap[task.category],
      status: task.status,
      statusLabel: onboardingTaskStatusLabelMap[task.status],
      dueDateLabel: task.dueDate ? formatDate(task.dueDate) : 'Sem prazo',
      dueDate: task.dueDate ?? null,
      completedAtLabel: task.completedAt ? formatDateTime(task.completedAt) : 'Ainda não concluída',
      assignedToLabel: task.assignedUser?.name ?? 'Sem responsável específico',
      blockerReason: task.blockerReason ?? null,
      evidenceLabel: task.evidenceFileName ?? null,
      evidenceUrl: task.evidenceFileUrl ?? null,
      isRequired: task.isRequired,
    }));

    return {
      category,
      label: onboardingCategoryLabelMap[category],
      summary: categoryDescriptions[category],
      completedCount: detailTasks.filter((task) => task.status === 'completed').length,
      totalCount: detailTasks.length,
      tasks: detailTasks,
    };
  });

export const getOnboardingOverviewForAdmin = async (): Promise<OnboardingOverviewData> => {
  const data = await executeAdminGraphql<OnboardingOverviewQueryData>(onboardingOverviewQuery);
  const items = data.onboardingJourneys.map((journey) => toOverviewItem(journey, data.onboardingTasks));

  return {
    metrics: {
      total: items.length,
      inProgress: items.filter((item) => item.status === 'in_progress').length,
      blocked: items.filter((item) => item.status === 'blocked').length,
      completed: items.filter((item) => item.status === 'completed').length,
      pendingDocuments: items.filter((item) => item.categorySummaries.documentation.status !== 'completed').length,
      pendingEquipment: items.filter((item) => item.categorySummaries.equipment.status !== 'completed').length,
      pendingSignatures: items.filter((item) => item.categorySummaries.signature.status !== 'completed').length,
      overdueTasks: items.reduce((total, item) => total + item.overdueTasksCount, 0),
    },
    departments: Array.from(new Set(items.map((item) => item.department))).sort((left, right) => left.localeCompare(right)),
    statuses: ['pending', 'in_progress', 'blocked', 'completed'],
    items,
  };
};

export const getOnboardingAttentionForAdmin = async (): Promise<OnboardingAttentionData> => {
  const data = await executeAdminGraphql<OnboardingAttentionQueryData>(onboardingAttentionQuery);
  const items = data.onboardingTasks
    .filter((task) => task.status === 'blocked' || isOverdue(task))
    .map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate ?? null,
      employeeName: task.journey.employee.fullName,
      journeyId: task.journey.id,
      updatedAt: task.updatedAt,
    }));

  return {
    total: items.length,
    items,
  };
};

export const getEmployeeOnboardingSnapshotForAdmin = async (
  employeeId: string,
): Promise<EmployeeOnboardingSnapshot> => {
  const data = await executeAdminGraphql<EmployeeOnboardingSummaryQueryData>(employeeOnboardingSummaryQuery, {
    employeeId,
  });
  const journey = data.onboardingJourneys[0];

  return {
    employeeId,
    journeyId: journey?.id ?? null,
    status: journey?.status ?? null,
    statusLabel: journey ? onboardingJourneyStatusLabelMap[journey.status] : null,
    progressPercent: journey?.progressPercent ?? null,
    currentStageLabel: journey?.currentStageLabel ?? null,
  };
};

export const getOnboardingJourneyDetailForAdmin = async (
  journeyId: string,
): Promise<OnboardingJourneyDetailData> => {
  const data = await executeAdminGraphql<OnboardingDetailQueryData>(onboardingDetailQuery, {
    journeyId,
  });
  const journey = data.onboardingJourneys[0];

  if (!journey) {
    throw new AppError('ONBOARDING_JOURNEY_NOT_FOUND', 'Jornada de onboarding não encontrada.');
  }

  const sections = buildSections(data.onboardingTasks);
  const totalTasks = data.onboardingTasks.length;
  const completedTasks = data.onboardingTasks.filter((task) => task.status === 'completed').length;
  const blockedTasks = data.onboardingTasks.filter((task) => task.status === 'blocked').length;
  const overdueTasks = data.onboardingTasks.filter((task) => isOverdue(task)).length;
  const progressPercent = getProgressPercent(data.onboardingTasks, journey.progressPercent);

  return {
    id: journey.id,
    employeeId: journey.employee.id,
    employeeName: journey.employee.fullName,
    employeeEmail: journey.employee.email ?? null,
    department: journey.employee.department?.name ?? 'Sem departamento',
    position: journey.employee.position ?? 'Cargo não informado',
    registrationNumber: formatRegistrationNumber(journey.employee.registrationNumber),
    hireDateLabel: journey.employee.hireDate ? formatDate(journey.employee.hireDate) : 'Não informado',
    phoneLabel: formatPhoneCompact(journey.employee.phone),
    ownerName: journey.ownerUser?.name ?? 'RH não atribuído',
    status: journey.status,
    statusLabel: onboardingJourneyStatusLabelMap[journey.status],
    progressPercent,
    currentStageLabel: journey.currentStageLabel ?? 'Fluxo inicial',
    startDateLabel: formatDate(journey.startDate),
    expectedEndDateLabel: journey.expectedEndDate ? formatDate(journey.expectedEndDate) : 'Sem previsão',
    completedAtLabel: journey.completedAt ? formatDateTime(journey.completedAt) : 'Ainda em andamento',
    notes: journey.notes ?? null,
    stats: {
      totalTasks,
      completedTasks,
      blockedTasks,
      overdueTasks,
    },
    sections,
    assigneeOptions: data.users.map((user) => ({
      id: user.id,
      label: user.name,
      supportingText: user.email,
    })),
  };
};

export const createOnboardingTaskForAdmin = async (
  journeyId: string,
  payload: OnboardingTaskCreateSchema,
  actorUserId: string,
): Promise<OnboardingJourneyDetailData> => {
  const currentJourney = await getOnboardingJourneyDetailForAdmin(journeyId);
  const sortOrder = currentJourney.stats.totalTasks + 1;

  const mutation = payload.assignedUserId
    ? createOnboardingTaskWithAssigneeMutation
    : createOnboardingTaskMutation;

  await executeAdminGraphql<OnboardingMutationData>(mutation, {
    journeyId,
    title: payload.title,
    category: payload.category,
    description: payload.description ?? null,
    dueDate: payload.dueDate ?? null,
    isRequired: payload.isRequired,
    sortOrder,
    assignedUserId: payload.assignedUserId ?? null,
  });

  await executeAdminGraphql<OnboardingMutationData>(createOnboardingAuditLogMutation, {
    userId: actorUserId,
    entityId: journeyId,
    action: 'onboarding.task.created',
    description: `Nova etapa "${payload.title}" registrada na jornada de onboarding.`,
  });

  await syncOnboardingJourneySnapshot(journeyId);

  return getOnboardingJourneyDetailForAdmin(journeyId);
};

export const updateOnboardingTaskStatusForAdmin = async (
  journeyId: string,
  taskId: string,
  payload: OnboardingTaskStatusSchema,
  actorUserId: string,
): Promise<OnboardingJourneyDetailData> => {
  await executeAdminGraphql<OnboardingMutationData>(updateOnboardingTaskMutation, {
    taskId,
    status: payload.status,
    blockerReason: payload.blockerReason ?? null,
    completedAt: payload.status === 'completed' ? new Date().toISOString() : null,
  });

  await executeAdminGraphql<OnboardingMutationData>(createOnboardingAuditLogMutation, {
    userId: actorUserId,
    entityId: taskId,
    action: 'onboarding.task.updated',
    description:
      payload.status === 'completed'
        ? 'Etapa de onboarding concluída.'
        : payload.status === 'blocked'
          ? `Etapa de onboarding bloqueada. Motivo: ${payload.blockerReason ?? 'não informado'}.`
          : 'Status da etapa de onboarding atualizado.',
  });

  await syncOnboardingJourneySnapshot(journeyId);

  return getOnboardingJourneyDetailForAdmin(journeyId);
};

export const initializeEmployeeOnboardingForAdmin = async (
  employeeId: string,
  actorUserId: string,
): Promise<EmployeeOnboardingSnapshot> => {
  const existing = await getEmployeeOnboardingSnapshotForAdmin(employeeId);

  if (existing.journeyId) {
    return existing;
  }

  const employeeData = await executeAdminGraphql<EmployeeForOnboardingQueryData>(employeeForOnboardingQuery, {
    employeeId,
  });
  const employee = employeeData.employees[0];

  if (!employee) {
    throw new AppError('EMPLOYEE_NOT_FOUND', 'Colaborador não encontrado para iniciar onboarding.');
  }

  const startDate = getStartDateBase(employee.hireDate);
  const startDateLabel = startDate.toISOString().slice(0, 10);
  const expectedEndDate = addDays(startDate, 14);
  const defaultTasks = onboardingDefaultTaskTemplates(employee.fullName, startDate);
  const initialStatus: OnboardingJourneyStatus =
    startDate.getTime() > nowTime() ? 'pending' : 'in_progress';

  const journeyResult = await executeAdminGraphql<OnboardingMutationData>(createOnboardingJourneyMutation, {
    employeeId,
    ownerUserId: actorUserId,
    status: initialStatus,
    startDate: startDateLabel,
    expectedEndDate,
    currentStageLabel: defaultTasks[0]?.title ?? 'Fluxo inicial',
    notes: `Jornada criada automaticamente a partir do cadastro de ${employee.fullName}.`,
  });

  const journeyId = journeyResult.onboardingJourney_insert?.id;

  if (!journeyId) {
    throw new AppError('ONBOARDING_JOURNEY_CREATE_FAILED', 'Não foi possível iniciar a jornada de onboarding.');
  }

  for (const [index, task] of defaultTasks.entries()) {
    await executeAdminGraphql<OnboardingMutationData>(createOnboardingTaskWithAssigneeMutation, {
      journeyId,
      title: task.title,
      category: task.category,
      description: task.description,
      dueDate: task.dueDate,
      isRequired: true,
      sortOrder: index + 1,
      assignedUserId: actorUserId,
    });
  }

  await executeAdminGraphql<OnboardingMutationData>(createOnboardingAuditLogMutation, {
    userId: actorUserId,
    entityId: journeyId,
    action: 'onboarding.journey.created',
    description: `Jornada de onboarding iniciada automaticamente para ${employee.fullName}.`,
  });

  await syncOnboardingJourneySnapshot(journeyId);

  return getEmployeeOnboardingSnapshotForAdmin(employeeId);
};

const syncOnboardingJourneySnapshot = async (journeyId: string): Promise<void> => {
  const detail = await getOnboardingJourneyDetailForAdmin(journeyId);
  const tasks = detail.sections.flatMap((section) =>
    section.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      isRequired: task.isRequired,
    })),
  );
  const snapshot = getJourneySnapshot(tasks);

  await executeAdminGraphql<OnboardingMutationData>(updateOnboardingJourneyMutation, {
    journeyId,
    status: snapshot.status,
    progressPercent: snapshot.progressPercent,
    currentStageLabel: snapshot.currentStageLabel,
    completedAt: snapshot.completedAt,
  });
};
