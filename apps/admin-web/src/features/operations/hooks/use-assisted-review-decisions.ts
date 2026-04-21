'use client';

import { queryKeys } from '@rh-ponto/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';
import { invalidateTimeRecordQueries } from '@/features/time-records/hooks/use-time-record-mutations';

import {
  assistedReviewAuditActions,
  buildAssistedReviewAuditPayload,
} from '../lib/assisted-review-audit';
import type { OperationsInboxItem } from '../lib/operations-inbox-service';

interface AssistedReviewDecisionInput {
  item: OperationsInboxItem;
  notes: string;
  reviewerUserId: string | null;
  reviewerName: string | null;
}

const invalidateAssistedReviewQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    invalidateTimeRecordQueries(queryClient),
    queryClient.invalidateQueries({ queryKey: ['operations-inbox'] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  ]);
};

const assertAssistedReview = (item: OperationsInboxItem) => {
  if (!item.assistedReview) {
    throw new Error('O item selecionado nao possui contexto de revisao assistida.');
  }

  return item.assistedReview;
};

export const useAssistedReviewDecisions = () => {
  const queryClient = useQueryClient();

  const approveSuggested = useMutation({
    mutationFn: async ({ item, notes, reviewerUserId, reviewerName }: AssistedReviewDecisionInput) => {
      const assistedReview = assertAssistedReview(item);

      const updatedRecord = await services.timeRecords.adjustTimeRecordUseCase.execute({
        timeRecordId: item.id,
        recordedAt: item.occurredAt,
        notes: notes.trim().length > 0 ? notes : assistedReview.suggestionReason,
      });

      await services.audit.createAuditLogUseCase.execute(
        buildAssistedReviewAuditPayload({
          action: assistedReviewAuditActions.approved,
          caseItem: assistedReview,
          notes,
          reviewerUserId,
          reviewerName,
        }),
      );

      return updatedRecord;
    },
    onSuccess: async () => {
      await invalidateAssistedReviewQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Nao foi possivel aprovar a sugestao assistida.');
    },
  });

  const rejectSuggested = useMutation({
    mutationFn: async ({ item, notes, reviewerUserId, reviewerName }: AssistedReviewDecisionInput) => {
      const assistedReview = assertAssistedReview(item);

      return services.audit.createAuditLogUseCase.execute(
        buildAssistedReviewAuditPayload({
          action: assistedReviewAuditActions.rejected,
          caseItem: assistedReview,
          notes,
          reviewerUserId,
          reviewerName,
        }),
      );
    },
    onSuccess: async () => {
      await invalidateAssistedReviewQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Nao foi possivel rejeitar a sugestao assistida.');
    },
  });

  const requestJustification = useMutation({
    mutationFn: async ({ item, notes, reviewerUserId, reviewerName }: AssistedReviewDecisionInput) => {
      const assistedReview = assertAssistedReview(item);

      return services.audit.createAuditLogUseCase.execute(
        buildAssistedReviewAuditPayload({
          action: assistedReviewAuditActions.justificationRequested,
          caseItem: assistedReview,
          notes,
          reviewerUserId,
          reviewerName,
        }),
      );
    },
    onSuccess: async () => {
      await invalidateAssistedReviewQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Nao foi possivel solicitar justificativa adicional.');
    },
  });

  const escalateCase = useMutation({
    mutationFn: async ({ item, notes, reviewerUserId, reviewerName }: AssistedReviewDecisionInput) => {
      const assistedReview = assertAssistedReview(item);

      return services.audit.createAuditLogUseCase.execute(
        buildAssistedReviewAuditPayload({
          action: assistedReviewAuditActions.escalated,
          caseItem: assistedReview,
          notes,
          reviewerUserId,
          reviewerName,
        }),
      );
    },
    onSuccess: async () => {
      await invalidateAssistedReviewQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Nao foi possivel escalar o caso assistido.');
    },
  });

  return {
    approveSuggested,
    rejectSuggested,
    requestJustification,
    escalateCase,
    isPending:
      approveSuggested.isPending ||
      rejectSuggested.isPending ||
      requestJustification.isPending ||
      escalateCase.isPending,
  };
};
