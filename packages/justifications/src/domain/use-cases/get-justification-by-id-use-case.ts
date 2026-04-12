import type { Justification } from '../entities/justification';
import type { JustificationRepository } from '../repositories/justification-repository';

export class GetJustificationByIdUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(id: string): Promise<Justification | null> {
    return this.justificationRepository.getById(id);
  }
}
