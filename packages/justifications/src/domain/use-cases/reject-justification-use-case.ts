import type { Justification } from '../entities/justification';
import type { JustificationRepository, RejectJustificationPayload } from '../repositories/justification-repository';

export class RejectJustificationUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(payload: RejectJustificationPayload): Promise<Justification> {
    return this.justificationRepository.reject(payload);
  }
}

