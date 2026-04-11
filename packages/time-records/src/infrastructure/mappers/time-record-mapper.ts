import type { TimeRecordDto, TimeRecordPhotoDto } from '../../application/dto/time-record-dto';
import {
  createTimeRecord,
  createTimeRecordPhoto,
  type TimeRecord,
  type TimeRecordPhoto,
} from '../../domain/entities/time-record';

export const mapTimeRecord = (record: TimeRecordDto): TimeRecord => createTimeRecord(record);

export const mapTimeRecordToDto = (record: TimeRecord): TimeRecordDto => ({
  ...record,
});

export const mapTimeRecordPhoto = (photo: TimeRecordPhotoDto): TimeRecordPhoto => createTimeRecordPhoto(photo);
