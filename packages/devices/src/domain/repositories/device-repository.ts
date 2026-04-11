import type { DateValue, DeviceType, Nullable } from '@rh-ponto/types';

import type { Device } from '../entities/device';

export interface CreateDevicePayload {
  name: string;
  identifier: string;
  type: DeviceType;
  locationName?: Nullable<string>;
  description?: Nullable<string>;
  isActive: boolean;
}

export interface UpdateDevicePayload extends Partial<CreateDevicePayload> {
  id: string;
}

export interface DeviceRepository {
  list(): Promise<Device[]>;
  getById(id: string): Promise<Device | null>;
  create(payload: CreateDevicePayload): Promise<Device>;
  update(payload: UpdateDevicePayload): Promise<Device>;
  deactivate(id: string): Promise<void>;
}

export type DevicesRepository = DeviceRepository;

