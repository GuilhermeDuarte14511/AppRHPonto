import type { Justification } from '../entities/justification';
import type { CreateJustificationPayload, JustificationRepository } from '../repositories/justification-repository';

export class CreateJustificationUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(payload: CreateJustificationPayload): Promise<Justification> {
    return this.justificationRepository.create(payload);
  }
}

