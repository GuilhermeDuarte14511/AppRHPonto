import type { AttendanceLocationEvaluationResult } from '@rh-ponto/attendance-policies';
import type { TimeRecord } from '@rh-ponto/time-records';
import type { TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

import { timeRecordStatusLabels, timeRecordTypeLabels } from './time-record-mobile';

export interface PunchReadinessItem {
  id: 'record_type' | 'coordinates' | 'address' | 'policy';
  label: string;
  description: string;
  state: 'ready' | 'warning' | 'blocked';
}

export interface PunchReadinessSummary {
  canProceed: boolean;
  checklist: PunchReadinessItem[];
  helperText: string;
}

export interface PunchPolicyExperience {
  status: 'allowed' | 'pending_review' | 'blocked';
  badgeLabel: string;
  headline: string;
  description: string;
  helper: string;
  reviewReasonTitle: string | null;
  reviewReasonDescription: string | null;
  nextStepLabel: string;
}

export interface TimeRecordOperationalInsight {
  attentionTone: 'neutral' | 'warning' | 'danger' | 'success';
  employeeActionLabel: string;
  employeeActionDescription: string;
  headline: string;
  reviewReasonDescription: string | null;
  reviewReasonTitle: string | null;
  statusLabel: string;
  summary: string;
}

const normalizeText = (value: string | null | undefined) =>
  (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const includesAny = (value: string, terms: string[]) => terms.some((term) => value.includes(term));

const reasonCodeTitles: Record<string, string> = {
  allow_any_location: 'Registro permitido fora de geofence fixa',
  location_missing: 'Localização ainda não confirmada',
  missing_allowed_locations: 'Sem local autorizado configurado',
  outside_allowed_area: 'Fora da área permitida',
  within_allowed_area: 'Dentro da área autorizada',
};

const inferRecordReason = (record: TimeRecord) => {
  const normalizedNotes = normalizeText(record.notes);

  if (
    includesAny(normalizedNotes, ['geolocal', 'geofence', 'fora da area', 'fora da regra de local', 'divergencia'])
  ) {
    return {
      title: 'Revisão por divergência de local',
      description:
        'O RH está conferindo se a marcação ocorreu em local compatível com sua política ou com uma exceção operacional válida.',
    };
  }

  if (includesAny(normalizedNotes, ['atraso', 'tolerancia', 'fora da tolerancia', 'janela', 'horario'])) {
    return {
      title: 'Revisão por desvio de horário',
      description:
        'O RH está validando se o horário registrado pode ser aceito dentro da jornada ou se precisa de justificativa complementar.',
    };
  }

  if (includesAny(normalizedNotes, ['selfie', 'foto', 'iluminacao', 'evidencia'])) {
    return {
      title: 'Revisão por evidência da marcação',
      description:
        'A marcação foi salva, mas a evidência visual ou operacional ainda precisa de conferência humana.',
    };
  }

  if (record.status === 'adjusted') {
    return {
      title: 'Ajuste concluído pelo RH',
      description:
        'A operação registrou uma correção na marcação e preservou o histórico do horário original para auditoria.',
    };
  }

  if (record.status === 'rejected') {
    return {
      title: 'Registro rejeitado na revisão',
      description:
        'O RH rejeitou a marcação como ela foi enviada e o caso pode exigir uma justificativa ou nova evidência.',
    };
  }

  return {
    title: null,
    description: null,
  };
};

export const buildPunchPolicyExperience = (
  evaluation: AttendanceLocationEvaluationResult | null,
): PunchPolicyExperience => {
  if (!evaluation) {
    return {
      status: 'pending_review',
      badgeLabel: 'Validando política',
      headline: 'Estamos validando sua política de marcação',
      description:
        'Assim que a política e a localização forem confirmadas, mostramos se a batida entra direto, segue para revisão ou fica bloqueada.',
      helper: 'Atualize a localização e aguarde o carregamento da política antes de capturar a foto.',
      reviewReasonTitle: null,
      reviewReasonDescription: null,
      nextStepLabel: 'Atualizar localização e aguardar a política',
    };
  }

  if (evaluation.status === 'allowed' && evaluation.reasonCode === 'allow_any_location') {
    return {
      status: 'allowed',
      badgeLabel: 'Liberado',
      headline: 'Sua política permite bater ponto deste local',
      description:
        'A batida pode ser registrada sem depender de uma geofence fixa, desde que foto, coordenadas e endereço sejam confirmados.',
      helper: 'O registro entra normalmente no histórico, salvo se surgir outra exceção operacional depois.',
      reviewReasonTitle: reasonCodeTitles[evaluation.reasonCode] ?? null,
      reviewReasonDescription:
        'Sua política aceita trabalho externo ou registro sem área fixa, então o GPS serve mais como rastreabilidade do que como bloqueio.',
      nextStepLabel: 'Confirmar foto e enviar a batida',
    };
  }

  if (evaluation.status === 'allowed') {
    return {
      status: 'allowed',
      badgeLabel: 'Dentro da regra',
      headline: 'Tudo certo para registrar sua batida',
      description:
        'A localização está compatível com a política e, se você confirmar a foto, a marcação entra direto na jornada.',
      helper: 'Depois de enviar, você pode acompanhar a marcação no histórico.',
      reviewReasonTitle: reasonCodeTitles[evaluation.reasonCode] ?? null,
      reviewReasonDescription:
        evaluation.reasonCode === 'within_allowed_area'
          ? 'Seu ponto ficou dentro da área autorizada para a política atual.'
          : null,
      nextStepLabel: 'Capturar foto e confirmar',
    };
  }

  if (evaluation.status === 'pending_review') {
    return {
      status: 'pending_review',
      badgeLabel: 'Vai para revisão',
      headline: 'Você pode registrar, mas o RH vai revisar',
      description:
        'A batida será aceita no app, porém ficará sinalizada para conferência operacional do RH antes do fechamento.',
      helper:
        'Isso costuma acontecer quando a política admite exceções com rastreabilidade, como local fora da área ou GPS incompleto.',
      reviewReasonTitle: reasonCodeTitles[evaluation.reasonCode] ?? 'Registro sujeito a revisão',
      reviewReasonDescription:
        evaluation.reasonCode === 'outside_allowed_area'
          ? 'Seu ponto ficou fora da área autorizada, mas sua política permite envio com revisão.'
          : evaluation.reasonCode === 'location_missing'
            ? 'Sua política tolera o envio sem GPS completo, mas exige conferência do RH.'
            : evaluation.description,
      nextStepLabel: 'Registrar e acompanhar o retorno do RH',
    };
  }

  return {
    status: 'blocked',
    badgeLabel: 'Bloqueado',
    headline: 'Esta batida não pode ser enviada agora',
    description:
      'A política atual exige uma condição que ainda não foi atendida, como localização válida dentro da regra.',
    helper: 'Atualize o GPS, confirme o endereço ou fale com o RH se você estiver em uma exceção operacional legítima.',
    reviewReasonTitle: reasonCodeTitles[evaluation.reasonCode] ?? 'Regra da política bloqueando o envio',
    reviewReasonDescription: evaluation.description,
    nextStepLabel: 'Corrigir a condição bloqueante antes de enviar',
  };
};

export const buildPunchReadinessSummary = ({
  evaluation,
  hasCoordinates,
  hasResolvedAddress,
  selectedRecordType,
}: {
  evaluation: AttendanceLocationEvaluationResult | null;
  hasCoordinates: boolean;
  hasResolvedAddress: boolean;
  selectedRecordType: TimeRecordType | null;
}): PunchReadinessSummary => {
  const checklist: PunchReadinessItem[] = [
    {
      id: 'record_type',
      label: 'Tipo da batida',
      description: selectedRecordType
        ? `${timeRecordTypeLabels[selectedRecordType]} selecionada para esta marcação.`
        : 'Escolha o tipo da batida antes de abrir a câmera.',
      state: selectedRecordType ? 'ready' : 'warning',
    },
    {
      id: 'coordinates',
      label: 'Coordenadas do GPS',
      description: hasCoordinates
        ? 'Sua posição foi capturada e está pronta para validação da política.'
        : 'O GPS ainda não confirmou sua posição atual.',
      state: hasCoordinates ? 'ready' : 'blocked',
    },
    {
      id: 'address',
      label: 'Endereço resolvido',
      description: hasResolvedAddress
        ? 'O endereço do local foi identificado para registrar contexto operacional.'
        : 'Ainda falta identificar o endereço do local para concluir a batida.',
      state: hasResolvedAddress ? 'ready' : 'blocked',
    },
    {
      id: 'policy',
      label: 'Política aplicada',
      description: evaluation
        ? buildPunchPolicyExperience(evaluation).headline
        : 'A política ainda está sendo validada para este ponto.',
      state:
        evaluation?.status === 'blocked'
          ? 'blocked'
          : evaluation == null || evaluation.status === 'pending_review'
            ? 'warning'
            : 'ready',
    },
  ];

  const canProceed =
    Boolean(selectedRecordType) &&
    hasCoordinates &&
    hasResolvedAddress &&
    Boolean(evaluation?.canSubmitPunch);

  return {
    canProceed,
    checklist,
    helperText: canProceed
      ? 'Tudo pronto. Capture a foto e confirme a marcação.'
      : 'Revise os itens acima para liberar o envio da batida.',
  };
};

export const buildTimeRecordOperationalInsight = (record: TimeRecord): TimeRecordOperationalInsight => {
  const reason = inferRecordReason(record);

  if (record.status === 'valid') {
    return {
      attentionTone: 'success',
      employeeActionLabel: 'Sem ação pendente',
      employeeActionDescription: 'Sua marcação entrou normalmente na jornada e não depende de nenhum retorno adicional.',
      headline: 'Marcação aceita na jornada',
      reviewReasonTitle: reason.title,
      reviewReasonDescription: reason.description,
      statusLabel: timeRecordStatusLabels[record.status],
      summary: 'O app registrou a batida e ela já pode ser acompanhada normalmente no histórico.',
    };
  }

  if (record.status === 'pending_review') {
    return {
      attentionTone: 'warning',
      employeeActionLabel: 'Acompanhar análise do RH',
      employeeActionDescription:
        'No momento, o mais importante é acompanhar o caso. Se o RH precisar de mais contexto, a próxima ação costuma ser abrir ou complementar uma justificativa.',
      headline: 'Marcação em revisão operacional',
      reviewReasonTitle: reason.title ?? 'Revisão pendente do RH',
      reviewReasonDescription:
        reason.description ??
        'O RH está analisando esta marcação antes do fechamento para confirmar que ela pode entrar normalmente na jornada.',
      statusLabel: timeRecordStatusLabels[record.status],
      summary: 'A batida foi aceita pelo app, mas ainda não foi homologada operacionalmente.',
    };
  }

  if (record.status === 'adjusted') {
    return {
      attentionTone: 'success',
      employeeActionLabel: 'Conferir o ajuste aplicado',
      employeeActionDescription:
        'Verifique o horário final e, se ainda houver divergência, abra um novo pedido de ajuste com o contexto atualizado.',
      headline: 'Marcação ajustada pela operação',
      reviewReasonTitle: reason.title,
      reviewReasonDescription: reason.description,
      statusLabel: timeRecordStatusLabels[record.status],
      summary:
        record.originalRecordedAt != null
          ? 'O RH concluiu uma correção e manteve o horário original registrado para auditoria.'
          : 'O RH atualizou esta marcação para refletir o contexto operacional validado.',
    };
  }

  return {
    attentionTone: 'danger',
    employeeActionLabel: 'Abrir ou complementar justificativa',
    employeeActionDescription:
      'Como a marcação foi rejeitada, o próximo passo mais comum é enviar contexto adicional, evidência ou um pedido de ajuste.',
    headline: 'Marcação rejeitada na revisão',
    reviewReasonTitle: reason.title,
    reviewReasonDescription: reason.description,
    statusLabel: timeRecordStatusLabels[record.status as TimeRecordStatus],
    summary: 'A batida não foi aceita como enviada e precisa de uma nova ação para seguir no fluxo.',
  };
};
