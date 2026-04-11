import type { Device } from '../../domain/entities/device';

export const toDeviceLabel = (device: Device): string => `${device.name} • ${device.locationName}`;

