import type {
  JustificationRepository,
  ReviewJustificationPayload,
} from '../repositories/justification-repository';

export class ReviewJustificationUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(payload: ReviewJustificationPayload) {
    if (payload.status === 'approved') {
      return this.justificationRepository.approve(payload);
    }

    return this.justificationRepository.reject(payload);
  }
}
