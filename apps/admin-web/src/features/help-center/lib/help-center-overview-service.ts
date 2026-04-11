import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

import { getPayrollOverview } from '@/features/payroll/lib/payroll-data-source';

const formatHours = (hours: number) => `${Math.max(1, Math.round(hours))} h`;

const averageResponseHours = (values: number[]) => {
  if (values.length === 0) {
    return 'Sem SLA calculado';
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return formatHours(total / values.length);
};

export const getHelpCenterOverview = async () => {
  const [snapshot, payrollOverview] = await Promise.all([fetchAdminLiveDataSnapshot(), getPayrollOverview()]);

  const pendingJustifications = snapshot.justifications.filter((item) => item.status === 'pending').length;
  const pendingVacations = snapshot.vacationRequests.filter((item) => item.status === 'pending').length;
  const pendingRecords = snapshot.timeRecords.filter((item) => item.status === 'pending_review').length;
  const employeesWithoutSchedule = snapshot.employees.filter(
    (employee) =>
      employee.isActive &&
      !snapshot.employeeScheduleHistories.some((history) => history.employeeId === employee.id && history.isCurrent),
  ).length;
  const inactiveDevices = snapshot.devices.filter((device) => !device.isActive).length;
  const approvedDocuments = snapshot.justificationAttachments.filter((attachment) => {
    const justification = snapshot.justifications.find((item) => item.id === attachment.justificationId);

    return justification?.status === 'approved';
  }).length;
  const reviewDocuments = snapshot.justificationAttachments.filter((attachment) => {
    const justification = snapshot.justifications.find((item) => item.id === attachment.justificationId);

    return justification?.status === 'pending';
  }).length;

  const reviewDurationsInHours = [
    ...snapshot.justifications
      .filter((item) => item.reviewedAt)
      .map((item) => (new Date(item.reviewedAt as string).getTime() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60)),
    ...snapshot.vacationRequests
      .filter((item) => item.hrApprovalTimestamp)
      .map((item) => (new Date(item.hrApprovalTimestamp as string).getTime() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60)),
  ].filter((value) => Number.isFinite(value) && value >= 0);

  const specialists = Array.from(
    new Map(
      snapshot.vacationRequests
        .flatMap((item) => [
          item.hrApprovalActor ? { id: `hr-${item.id}`, name: item.hrApprovalActor, role: 'RH' } : null,
          item.managerApprovalActor ? { id: `manager-${item.id}`, name: item.managerApprovalActor, role: 'Liderança' } : null,
        ])
        .filter((item): item is { id: string; name: string; role: string } => Boolean(item))
        .map((item) => [item.name, item]),
    ).values(),
  ).slice(0, 3);

  return {
    hero: {
      title: 'Central operacional do RH',
      description: `Hoje existem ${pendingJustifications} justificativa(s), ${pendingVacations} férias pendentes e ${payrollOverview.pending} espelho(s) de folha aguardando atenção.`,
      placeholder: "Busque por 'justificativas', 'férias' ou 'folha'",
    },
    categories: [
      {
        id: 'approvals',
        title: 'Aprovações',
        description: `${pendingJustifications + pendingVacations} decisões abertas entre justificativas e férias.`,
        icon: 'rocket',
      },
      {
        id: 'timekeeping',
        title: 'Jornada e marcações',
        description: `${pendingRecords} marcações fora do fluxo ideal e prontas para revisão.`,
        icon: 'settings',
      },
      {
        id: 'payroll',
        title: 'Fechamento da folha',
        description: `${payrollOverview.pending} espelho(s) pendente(s) e ${payrollOverview.criticalIssues} alerta(s) crítico(s).`,
        icon: 'calendar',
      },
      {
        id: 'coverage',
        title: 'Escalas e cobertura',
        description: `${employeesWithoutSchedule} colaborador(es) sem escala atual e ${inactiveDevices} dispositivo(s) inativo(s).`,
        icon: 'code',
      },
    ],
    articles: [
      {
        id: 'task-justifications',
        categoryId: 'approvals',
        title: 'Revisar justificativas pendentes',
        description: 'Conferir anexos, validar argumentos apresentados e decidir os pedidos que ainda dependem do RH.',
        readTime: 'Prioridade alta',
        views: `${pendingJustifications} registro(s) aguardando decisão`,
      },
      {
        id: 'task-vacations',
        categoryId: 'approvals',
        title: 'Concluir análise de férias',
        description: 'Verificar saldo, cobertura operacional e documentação dos pedidos que ainda aguardam aprovação final.',
        readTime: 'Fila ativa',
        views: `${pendingVacations} solicitação(ões) em aberto`,
      },
      {
        id: 'task-payroll',
        categoryId: 'payroll',
        title: 'Fechar a competência em andamento',
        description: 'Os espelhos individuais ainda dependem de conferência antes da conclusão do ciclo de folha.',
        readTime: payrollOverview.isClosed ? 'Competência fechada' : 'Em andamento',
        views: `${payrollOverview.pending} espelho(s) pendente(s)`,
      },
      {
        id: 'task-documents',
        categoryId: 'timekeeping',
        title: 'Conferir documentos operacionais',
        description: 'Os anexos recebidos pelas justificativas aprovadas e pendentes continuam disponíveis para rastreabilidade.',
        readTime: 'Conferência documental',
        views: `${approvedDocuments + reviewDocuments} documento(s) vinculados`,
      },
      {
        id: 'task-coverage',
        categoryId: 'coverage',
        title: 'Regularizar escalas e cobertura',
        description: 'Evite lacunas operacionais vinculando jornadas atuais e verificando os terminais de marcação inativos.',
        readTime: 'Cobertura operacional',
        views: `${employeesWithoutSchedule + inactiveDevices} ponto(s) de atenção`,
      },
    ],
    channels: [
      {
        id: 'channel-approvals',
        title: 'Abrir aprovações',
        description: 'Ir direto para a fila de justificativas e férias pendentes do RH.',
        status: 'online',
        cta: 'Ação imediata',
        icon: 'message',
      },
      {
        id: 'channel-payroll',
        title: 'Ir para a folha',
        description: 'Conferir o fechamento em andamento e validar os espelhos pendentes da competência.',
        status: 'standard',
        cta: 'Abrir folha',
        icon: 'ticket',
      },
      {
        id: 'channel-audit',
        title: 'Ver auditoria recente',
        description: 'Acompanhar alterações sensíveis, ajustes de ponto e eventos administrativos mais recentes.',
        status: 'external',
        cta: 'Abrir auditoria',
        icon: 'file-text',
      },
    ],
    specialists,
    responseTime: averageResponseHours(reviewDurationsInHours),
    videoGuide: {
      title: 'Playbook do dia',
      description: 'Use esta central para abrir rapidamente os módulos que concentram as maiores filas e riscos operacionais da rotina atual.',
      cta: 'Seguir prioridades',
    },
    quickLinks: [
      {
        id: 'quick-link-justifications',
        title: 'Justificativas',
        description: `${pendingJustifications} item(ns) aguardando decisão do RH.`,
        href: '/justifications',
      },
      {
        id: 'quick-link-vacations',
        title: 'Férias',
        description: `${pendingVacations} pedido(s) pendente(s) de aprovação final.`,
        href: '/vacations',
      },
      {
        id: 'quick-link-payroll',
        title: 'Folha',
        description: `${payrollOverview.pending} espelho(s) ainda exigem conferência.`,
        href: '/payroll',
      },
    ],
  };
};
