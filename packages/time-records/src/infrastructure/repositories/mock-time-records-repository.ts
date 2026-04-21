import { AppError } from '@rh-ponto/core';

import type { TimeRecord, TimeRecordPhoto } from '../../domain/entities/time-record';
import type {
  AdjustTimeRecordPayload,
  CreateTimeRecordPayload,
  TimeRecordFilters,
  TimeRecordRepository,
} from '../../domain/repositories/time-record-repository';

const timeRecordsSeed: TimeRecord[] = [
  {
    id: 'tr-12',
    employeeId: 'emp-9',
    deviceId: 'device-2',
    recordedByUserId: null,
    recordType: 'exit',
    source: 'employee_app',
    status: 'valid',
    recordedAt: '2026-04-04T21:08:00.000Z',
    originalRecordedAt: null,
    notes: 'Saída validada no app após conferência de política híbrida.',
    isManual: false,
    referenceRecordId: null,
    latitude: -23.56415,
    longitude: -46.65242,
    resolvedAddress: 'Rua Haddock Lobo, 595 - Cerqueira César - São Paulo - SP',
    ipAddress: '177.55.10.40',
    createdAt: '2026-04-04T21:08:00.000Z',
    updatedAt: '2026-04-04T21:08:00.000Z',
  },
  {
    id: 'tr-10',
    employeeId: 'emp-7',
    deviceId: 'device-1',
    recordedByUserId: null,
    recordType: 'entry',
    source: 'kiosk',
    status: 'pending_review',
    recordedAt: '2026-04-03T12:18:00.000Z',
    originalRecordedAt: null,
    notes: 'Entrada com 18 minutos de atraso. RH solicitou justificativa com comprovante do trajeto.',
    isManual: false,
    referenceRecordId: null,
    latitude: -23.55052,
    longitude: -46.633308,
    resolvedAddress: 'Avenida Paulista, 1000 - Bela Vista - São Paulo - SP',
    ipAddress: '10.0.0.18',
    createdAt: '2026-04-03T12:18:00.000Z',
    updatedAt: '2026-04-03T12:18:00.000Z',
  },
  {
    id: 'tr-9',
    employeeId: 'emp-4',
    deviceId: 'device-1',
    recordedByUserId: null,
    recordType: 'entry',
    source: 'kiosk',
    status: 'valid',
    recordedAt: '2026-04-03T11:02:00.000Z',
    originalRecordedAt: null,
    notes: null,
    isManual: false,
    referenceRecordId: null,
    latitude: -23.55052,
    longitude: -46.633308,
    resolvedAddress: 'Avenida Paulista, 1000 - Bela Vista - São Paulo - SP',
    ipAddress: '10.0.0.14',
    createdAt: '2026-04-03T11:02:00.000Z',
    updatedAt: '2026-04-03T11:02:00.000Z',
  },
  {
    id: 'tr-8',
    employeeId: 'emp-1',
    deviceId: 'device-1',
    recordedByUserId: null,
    recordType: 'break_start',
    source: 'kiosk',
    status: 'valid',
    recordedAt: '2026-04-03T15:01:00.000Z',
    originalRecordedAt: null,
    notes: null,
    isManual: false,
    referenceRecordId: 'tr-1',
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    ipAddress: '10.0.0.10',
    createdAt: '2026-04-03T15:01:00.000Z',
    updatedAt: '2026-04-03T15:01:00.000Z',
  },
  {
    id: 'tr-7',
    employeeId: 'emp-1',
    deviceId: 'device-1',
    recordedByUserId: null,
    recordType: 'break_end',
    source: 'kiosk',
    status: 'valid',
    recordedAt: '2026-04-03T16:03:00.000Z',
    originalRecordedAt: null,
    notes: null,
    isManual: false,
    referenceRecordId: 'tr-8',
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    ipAddress: '10.0.0.10',
    createdAt: '2026-04-03T16:03:00.000Z',
    updatedAt: '2026-04-03T16:03:00.000Z',
  },
  {
    id: 'tr-6',
    employeeId: 'emp-8',
    deviceId: null,
    recordedByUserId: 'user-admin-1',
    recordType: 'entry',
    source: 'admin_adjustment',
    status: 'adjusted',
    recordedAt: '2026-04-03T11:05:00.000Z',
    originalRecordedAt: '2026-04-03T11:33:00.000Z',
    notes: 'Ajuste manual após comprovação de indisponibilidade no kiosk da recepcao.',
    isManual: true,
    referenceRecordId: null,
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    ipAddress: '177.10.10.20',
    createdAt: '2026-04-03T11:36:00.000Z',
    updatedAt: '2026-04-03T11:40:00.000Z',
  },
  {
    id: 'tr-5',
    employeeId: 'emp-5',
    deviceId: null,
    recordedByUserId: 'user-admin-1',
    recordType: 'entry',
    source: 'admin_adjustment',
    status: 'adjusted',
    recordedAt: '2026-04-02T12:00:00.000Z',
    originalRecordedAt: null,
    notes: 'Registro criado manualmente após declaração de reuniao externa. Historico original preservado.',
    isManual: true,
    referenceRecordId: null,
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    ipAddress: '177.10.10.21',
    createdAt: '2026-04-02T12:10:00.000Z',
    updatedAt: '2026-04-02T12:10:00.000Z',
  },
  {
    id: 'tr-4',
    employeeId: 'emp-6',
    deviceId: 'device-2',
    recordedByUserId: null,
    recordType: 'entry',
    source: 'employee_app',
    status: 'pending_review',
    recordedAt: '2026-04-02T12:14:00.000Z',
    originalRecordedAt: null,
    notes: 'Selfie com baixa iluminação e coordenada fora do raio autorizado. Validacao humana solicitada.',
    isManual: false,
    referenceRecordId: null,
    latitude: -23.56415,
    longitude: -46.65242,
    resolvedAddress: 'Rua Haddock Lobo, 595 - Cerqueira César - São Paulo - SP',
    ipAddress: '177.55.10.10',
    createdAt: '2026-04-02T12:14:00.000Z',
    updatedAt: '2026-04-02T12:14:00.000Z',
  },
  {
    id: 'tr-1',
    employeeId: 'emp-1',
    deviceId: 'device-1',
    recordedByUserId: null,
    recordType: 'entry',
    source: 'kiosk',
    status: 'valid',
    recordedAt: '2026-03-31T11:58:00.000Z',
    originalRecordedAt: null,
    notes: null,
    isManual: false,
    referenceRecordId: null,
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    ipAddress: '10.0.0.10',
    createdAt: '2026-03-31T11:58:00.000Z',
    updatedAt: '2026-03-31T11:58:00.000Z',
  },
  {
    id: 'tr-2',
    employeeId: 'emp-2',
    deviceId: 'device-1',
    recordedByUserId: null,
    recordType: 'entry',
    source: 'kiosk',
    status: 'pending_review',
    recordedAt: '2026-03-31T12:17:00.000Z',
    originalRecordedAt: null,
    notes: 'Entrada fora da tolerancia e sem comprovacao de geofence.',
    isManual: false,
    referenceRecordId: null,
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    ipAddress: '10.0.0.12',
    createdAt: '2026-03-31T12:17:00.000Z',
    updatedAt: '2026-03-31T12:17:00.000Z',
  },
  {
    id: 'tr-3',
    employeeId: 'emp-1',
    deviceId: null,
    recordedByUserId: 'user-admin-1',
    recordType: 'exit',
    source: 'admin_adjustment',
    status: 'adjusted',
    recordedAt: '2026-03-31T21:05:00.000Z',
    originalRecordedAt: '2026-03-31T20:55:00.000Z',
    notes: 'Ajuste aprovado pelo RH com trilha de auditoria preservada.',
    isManual: true,
    referenceRecordId: 'tr-1',
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    ipAddress: '177.10.10.10',
    createdAt: '2026-03-31T21:05:00.000Z',
    updatedAt: '2026-03-31T21:05:00.000Z',
  },
  {
    id: 'tr-11',
    employeeId: 'emp-2',
    deviceId: 'device-2',
    recordedByUserId: null,
    recordType: 'exit',
    source: 'employee_app',
    status: 'rejected',
    recordedAt: '2026-04-02T21:41:00.000Z',
    originalRecordedAt: null,
    notes: 'Solicitacao rejeitada por divergencia de geolocalizacao e inconsistencias com a politica.',
    isManual: false,
    referenceRecordId: null,
    latitude: -23.5912,
    longitude: -46.6761,
    resolvedAddress: 'Rua Vergueiro, 3185 - Vila Mariana - Sao Paulo - SP',
    ipAddress: '177.55.10.14',
    createdAt: '2026-04-02T21:41:00.000Z',
    updatedAt: '2026-04-02T22:12:00.000Z',
  },
];

let timeRecordPhotos: TimeRecordPhoto[] = [
  {
    id: 'photo-10',
    timeRecordId: 'tr-10',
    fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    fileName: 'entry-ricardo.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 211402,
    isPrimary: true,
    createdAt: '2026-04-03T12:18:00.000Z',
  },
  {
    id: 'photo-9',
    timeRecordId: 'tr-9',
    fileUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    fileName: 'entry-beatriz.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 203500,
    isPrimary: true,
    createdAt: '2026-04-03T11:02:00.000Z',
  },
  {
    id: 'photo-8',
    timeRecordId: 'tr-6',
    fileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    fileName: 'adjusted-fernanda.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 198320,
    isPrimary: true,
    createdAt: '2026-04-03T11:36:00.000Z',
  },
  {
    id: 'photo-7',
    timeRecordId: 'tr-4',
    fileUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
    fileName: 'entry-juliana-low-light.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 188410,
    isPrimary: true,
    createdAt: '2026-04-02T12:14:00.000Z',
  },
  {
    id: 'photo-3',
    timeRecordId: 'tr-12',
    fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    fileName: 'exit-rafaela-home-office.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 205310,
    isPrimary: true,
    createdAt: '2026-04-04T21:08:00.000Z',
  },
  {
    id: 'photo-4',
    timeRecordId: 'tr-4',
    fileUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    fileName: 'entry-juliana-contexto.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 176240,
    isPrimary: false,
    createdAt: '2026-04-02T12:15:00.000Z',
  },
  {
    id: 'photo-5',
    timeRecordId: 'tr-11',
    fileUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    fileName: 'exit-ana-evidence.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 187440,
    isPrimary: false,
    createdAt: '2026-04-02T21:41:00.000Z',
  },
  {
    id: 'photo-1',
    timeRecordId: 'tr-1',
    fileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    fileName: 'entry-joao.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 210000,
    isPrimary: true,
    createdAt: '2026-03-31T11:58:00.000Z',
  },
  {
    id: 'photo-2',
    timeRecordId: 'tr-2',
    fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    fileName: 'entry-ana.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 200100,
    isPrimary: true,
    createdAt: '2026-03-31T12:17:00.000Z',
  },
  {
    id: 'photo-11',
    timeRecordId: 'tr-11',
    fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    fileName: 'exit-ana.jpg',
    contentType: 'image/jpeg',
    fileSizeBytes: 194870,
    isPrimary: true,
    createdAt: '2026-04-02T21:41:00.000Z',
  },
];

let timeRecords = [...timeRecordsSeed];

export class MockTimeRecordsRepository implements TimeRecordRepository {
  async list(filters?: TimeRecordFilters): Promise<TimeRecord[]> {
    return timeRecords.filter((timeRecord) => {
      const matchesEmployee = filters?.employeeId ? timeRecord.employeeId === filters.employeeId : true;
      const matchesStatus = filters?.status ? timeRecord.status === filters.status : true;
      const matchesRecordType = filters?.recordType ? timeRecord.recordType === filters.recordType : true;

      return matchesEmployee && matchesStatus && matchesRecordType;
    });
  }

  async listByEmployee(employeeId: string): Promise<TimeRecord[]> {
    return timeRecords.filter((timeRecord) => timeRecord.employeeId === employeeId);
  }

  async getById(id: string): Promise<TimeRecord | null> {
    return timeRecords.find((timeRecord) => timeRecord.id === id) ?? null;
  }

  async create(payload: CreateTimeRecordPayload): Promise<TimeRecord> {
    const timestamp = new Date().toISOString();
    const record: TimeRecord = {
      id: `tr-${timeRecords.length + 1}`,
      deviceId: payload.deviceId ?? null,
      recordedByUserId: payload.recordedByUserId ?? null,
      originalRecordedAt: payload.originalRecordedAt ?? null,
      notes: payload.notes ?? null,
      referenceRecordId: payload.referenceRecordId ?? null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      resolvedAddress: payload.resolvedAddress ?? null,
      ipAddress: payload.ipAddress ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload,
    };

    timeRecords = [record, ...timeRecords];

    return record;
  }

  async adjust(payload: AdjustTimeRecordPayload): Promise<TimeRecord> {
    const existingRecord = timeRecords.find((record) => record.id === payload.timeRecordId);

    if (!existingRecord) {
      throw new AppError('TIME_RECORD_NOT_FOUND', 'Marcação não encontrada.');
    }

    const adjustedRecord: TimeRecord = {
      ...existingRecord,
      recordedAt: payload.recordedAt,
      originalRecordedAt: existingRecord.originalRecordedAt ?? existingRecord.recordedAt,
      notes: payload.notes ?? existingRecord.notes,
      status: 'adjusted',
      isManual: true,
      updatedAt: new Date().toISOString(),
    };

    timeRecords = timeRecords.map((record) => (record.id === adjustedRecord.id ? adjustedRecord : record));

    return adjustedRecord;
  }

  async listPhotosByRecord(recordId: string): Promise<TimeRecordPhoto[]> {
    return timeRecordPhotos.filter((photo) => photo.timeRecordId === recordId);
  }

  async attachPhoto(payload: Omit<TimeRecordPhoto, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeRecordPhoto> {
    const timestamp = new Date().toISOString();
    const photo: TimeRecordPhoto = {
      id: `photo-${timeRecordPhotos.length + 1}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload,
    };
    timeRecordPhotos = [photo, ...timeRecordPhotos];
    return photo;
  }
}
