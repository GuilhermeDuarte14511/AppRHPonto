import type {
  AttendancePolicyMode,
  AttendanceValidationStrategy,
  WorkLocationType,
} from '@rh-ponto/types';

export const formatAttendancePolicyModeLabel = (value: AttendancePolicyMode) => {
  switch (value) {
    case 'company_only':
      return 'Somente empresa';
    case 'home_only':
      return 'Somente residência';
    case 'hybrid':
      return 'Híbrido';
    case 'free':
      return 'Livre';
    case 'field':
      return 'Externo / campo';
    default:
      return value;
  }
};

export const formatAttendanceValidationStrategyLabel = (value: AttendanceValidationStrategy) => {
  switch (value) {
    case 'block':
      return 'Bloquear fora da regra';
    case 'pending_review':
      return 'Permitir e enviar para revisão';
    case 'allow':
      return 'Permitir e apenas auditar';
    default:
      return value;
  }
};

export const formatWorkLocationTypeLabel = (value: WorkLocationType) => {
  switch (value) {
    case 'company':
      return 'Empresa';
    case 'home':
      return 'Residência';
    case 'branch':
      return 'Filial';
    case 'client_site':
      return 'Cliente';
    case 'free_zone':
      return 'Zona livre';
    default:
      return value;
  }
};
