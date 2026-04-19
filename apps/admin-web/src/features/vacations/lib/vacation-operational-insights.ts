import type { VacationRequest } from '../types/vacation-request';

const ACTIVE_STATUSES = new Set(['pending', 'approved']);

const parseDate = (value: string) => new Date(value).getTime();

const datesOverlap = (leftStartDate: string, leftEndDate: string, rightStartDate: string, rightEndDate: string) =>
  parseDate(leftStartDate) <= parseDate(rightEndDate) && parseDate(rightStartDate) <= parseDate(leftEndDate);

export const buildVacationOperationalInsight = (
  currentRequest: Pick<VacationRequest, 'id' | 'department' | 'startDate' | 'endDate'>,
  requests: Array<Pick<VacationRequest, 'id' | 'employeeName' | 'department' | 'startDate' | 'endDate' | 'status'>>,
): VacationRequest['operationalInsight'] => {
  const overlappingRequests = requests.filter(
    (request) =>
      request.id !== currentRequest.id &&
      request.department === currentRequest.department &&
      ACTIVE_STATUSES.has(request.status) &&
      datesOverlap(currentRequest.startDate, currentRequest.endDate, request.startDate, request.endDate),
  );
  const overlappingApprovedCount = overlappingRequests.filter((request) => request.status === 'approved').length;
  const overlappingPendingCount = overlappingRequests.filter((request) => request.status === 'pending').length;
  const overlapCount = overlappingRequests.length;
  const coverageRisk = overlapCount >= 2 ? 'high' : overlapCount === 1 ? 'medium' : 'low';

  return {
    overlapCount,
    overlappingApprovedCount,
    overlappingPendingCount,
    overlappingEmployeeNames: overlappingRequests.map((request) => request.employeeName),
    coverageRisk,
    summary:
      overlapCount === 0
        ? 'Sem conflito de cobertura na mesma área para o período selecionado.'
        : overlapCount === 1
          ? 'Há 1 outro afastamento ativo ou pendente na mesma área durante o período.'
          : `Há ${overlapCount} afastamentos ativos ou pendentes na mesma área durante o período.`,
  };
};

export const attachVacationOperationalInsights = (requests: VacationRequest[]) =>
  requests.map((request) => ({
    ...request,
    operationalInsight: buildVacationOperationalInsight(request, requests),
  }));
