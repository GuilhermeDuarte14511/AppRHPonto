import type { Device } from '../../domain/entities/device';
import type { CreateDevicePayload, DeviceRepository, UpdateDevicePayload } from '../../domain/repositories/device-repository';

let devices: Device[] = [
  {
    id: 'device-1',
    name: 'Tablet Portaria',
    identifier: 'TAB-PORT-01',
    type: 'kiosk',
    locationName: 'Recepcao',
    description: 'Dispositivo principal para marcação de ponto.',
    isActive: true,
    lastSyncAt: '2026-04-01T12:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
];

export class MockDevicesRepository implements DeviceRepository {
  async list(): Promise<Device[]> {
    return devices;
  }

  async getById(id: string): Promise<Device | null> {
    return devices.find((device) => device.id === id) ?? null;
  }

  async create(payload: CreateDevicePayload): Promise<Device> {
    const device: Device = {
      id: `device-${devices.length + 1}`,
      locationName: payload.locationName ?? null,
      description: payload.description ?? null,
      lastSyncAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };

    devices = [device, ...devices];

    return device;
  }

  async update(payload: UpdateDevicePayload): Promise<Device> {
    const existing = devices.find((device) => device.id === payload.id);

    if (!existing) {
      throw new Error('Device not found.');
    }

    const updated: Device = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    devices = devices.map((device) => (device.id === updated.id ? updated : device));

    return updated;
  }

  async deactivate(id: string): Promise<void> {
    devices = devices.map((device) =>
      device.id === id
        ? {
            ...device,
            isActive: false,
            updatedAt: new Date().toISOString(),
          }
        : device,
    );
  }
}
