import type { JustificationAttachmentDto, JustificationDto } from '../../application/dto/justification-dto';
import {
  createJustification,
  createJustificationAttachment,
  type Justification,
  type JustificationAttachment,
} from '../../domain/entities/justification';

export const mapJustification = (justification: JustificationDto): Justification => createJustification(justification);

export const mapJustificationToDto = (justification: Justification): JustificationDto => ({
  ...justification,
});

export const mapJustificationAttachment = (
  attachment: JustificationAttachmentDto,
): JustificationAttachment => createJustificationAttachment(attachment);

export const mapJustificationAttachmentToDto = (
  attachment: JustificationAttachment,
): JustificationAttachmentDto => ({
  ...attachment,
});
