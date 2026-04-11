import type { Device } from '../entities/device';
import type { CreateDevicePayload, DeviceRepository } from '../repositories/device-repository';

export class CreateDeviceUseCase {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  execute(payload: CreateDevicePayload): Promise<Device> {
    return this.deviceRepository.create(payload);
  }
}

