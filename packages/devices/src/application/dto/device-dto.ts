import type { DateValue, DeviceType, Nullable } from '@rh-ponto/types';

export interface DeviceDto {
  id: string;
  name: string;
  identifier: string;
  type: DeviceType;
  locationName: Nullable<string>;
  description: Nullable<string>;
  isActive: boolean;
  lastSyncAt: Nullable<DateValue>;
  createdAt: DateValue;
  updatedAt: DateValue;
}

export interface DeviceListItemDto {
  id: string;
  name: string;
  type: DeviceType;
  locationName: Nullable<string>;
}
