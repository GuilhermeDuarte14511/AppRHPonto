import type { Device } from '../../domain/entities/device';

export interface DeviceViewModel {
  id: string;
  name: string;
  locationName: string;
  typeLabel: string;
  statusLabel: string;
}

export const toDeviceViewModel = (device: Device): DeviceViewModel => ({
  id: device.id,
  name: device.name,
  locationName: device.locationName ?? 'Sem local',
  typeLabel: device.type,
  statusLabel: device.isActive ? 'Ativo' : 'Inativo',
});

