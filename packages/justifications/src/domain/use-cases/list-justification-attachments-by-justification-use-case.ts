import type { JustificationAttachment } from '../entities/justification';
import type { JustificationRepository } from '../repositories/justification-repository';

export class ListJustificationAttachmentsByJustificationUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(justificationId: string): Promise<JustificationAttachment[]> {
    return this.justificationRepository.listAttachmentsByJustification(justificationId);
  }
}
