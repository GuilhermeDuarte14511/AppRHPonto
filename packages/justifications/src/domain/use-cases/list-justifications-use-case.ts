import type { JustificationFilters, JustificationRepository } from '../repositories/justification-repository';

export class ListJustificationsUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(filters?: JustificationFilters) {
    return this.justificationRepository.list(filters);
  }
}
