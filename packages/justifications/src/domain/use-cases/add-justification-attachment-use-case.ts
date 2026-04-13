import type { JustificationAttachment } from '../entities/justification';
import type {
  AddJustificationAttachmentPayload,
  JustificationRepository,
} from '../repositories/justification-repository';

export class AddJustificationAttachmentUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(payload: AddJustificationAttachmentPayload): Promise<JustificationAttachment> {
    return this.justificationRepository.addAttachment(payload);
  }
}
