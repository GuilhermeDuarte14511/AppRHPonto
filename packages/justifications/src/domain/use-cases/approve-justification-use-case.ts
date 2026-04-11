import type { Justification } from '../entities/justification';
import type { ApproveJustificationPayload, JustificationRepository } from '../repositories/justification-repository';

export class ApproveJustificationUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(payload: ApproveJustificationPayload): Promise<Justification> {
    return this.justificationRepository.approve(payload);
  }
}

