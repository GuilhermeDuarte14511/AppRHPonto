import type { Device } from '../entities/device';
import type { DeviceRepository } from '../repositories/device-repository';

export class GetDeviceByIdUseCase {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  execute(id: string): Promise<Device | null> {
    return this.deviceRepository.getById(id);
  }
}
