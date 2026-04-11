import type { DeviceDto } from '../../application/dto/device-dto';
import { createDevice, type Device } from '../../domain/entities/device';

export const mapDevice = (device: DeviceDto): Device => createDevice(device);

export const mapDeviceToDto = (device: Device): DeviceDto => ({
  ...device,
});
