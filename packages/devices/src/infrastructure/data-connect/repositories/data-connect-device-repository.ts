import {
  createDevice as createDeviceMutation,
  deactivateDevice,
  getDeviceById,
  listDevices,
  updateDevice,
  type CreateDeviceVariables,
  type GetDeviceByIdData,
  type ListDevicesData,
  type UpdateDeviceVariables,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';
import { deviceTypes, type DeviceType } from '@rh-ponto/types';

import { createDevice, type Device } from '../../../domain/entities/device';
import type { CreateDevicePayload, DeviceRepository, UpdateDevicePayload } from '../../../domain/repositories/device-repository';

const assertDeviceType = (value: string): DeviceType => {
  if (!deviceTypes.includes(value as DeviceType)) {
    throw new AppError('DEVICE_INVALID_TYPE', 'Tipo de dispositivo inválido retornado pelo Data Connect.');
  }

  return value as DeviceType;
};

const mapDeviceRecord = (
  record: ListDevicesData['devices'][number] | NonNullable<GetDeviceByIdData['device']>,
): Device =>
  createDevice({
    id: record.id,
    name: record.name,
    identifier: record.identifier,
    type: assertDeviceType(record.type),
    locationName: record.locationName ?? null,
    description: record.description ?? null,
    isActive: record.isActive,
    lastSyncAt: record.lastSyncAt ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const buildCreateVariables = (payload: CreateDevicePayload): CreateDeviceVariables => ({
  name: payload.name,
  identifier: payload.identifier,
  type: payload.type,
  locationName: payload.locationName ?? null,
  description: payload.description ?? null,
  isActive: payload.isActive,
});

const buildUpdateVariables = (payload: UpdateDevicePayload): UpdateDeviceVariables => ({
  id: payload.id,
  name: payload.name,
  identifier: payload.identifier,
  type: payload.type,
  locationName: payload.locationName,
  description: payload.description,
  isActive: payload.isActive,
});

export class DataConnectDeviceRepository implements DeviceRepository {
  async list(): Promise<Device[]> {
    const { data } = await listDevices(getAppDataConnect());

    return data.devices.map(mapDeviceRecord);
  }

  async getById(id: string): Promise<Device | null> {
    const { data } = await getDeviceById(getAppDataConnect(), { id });

    return data.device ? mapDeviceRecord(data.device) : null;
  }

  async create(payload: CreateDevicePayload): Promise<Device> {
    const { data } = await createDeviceMutation(getAppDataConnect(), buildCreateVariables(payload));
    const device = await this.getById(data.device_insert.id);

    if (!device) {
      throw new AppError('DEVICE_NOT_FOUND_AFTER_CREATE', 'Dispositivo não encontrado após criação.');
    }

    return device;
  }

  async update(payload: UpdateDevicePayload): Promise<Device> {
    const { data } = await updateDevice(getAppDataConnect(), buildUpdateVariables(payload));
    const deviceId = data.device_update?.id;

    if (!deviceId) {
      throw new AppError('DEVICE_NOT_FOUND', 'Dispositivo não encontrado para atualização.');
    }

    const device = await this.getById(deviceId);

    if (!device) {
      throw new AppError('DEVICE_NOT_FOUND_AFTER_UPDATE', 'Dispositivo não encontrado após atualização.');
    }

    return device;
  }

  async deactivate(id: string): Promise<void> {
    await deactivateDevice(getAppDataConnect(), { id });
  }
}
