import type { DeviceRepository } from '../repositories/device-repository';

export class DeactivateDeviceUseCase {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  execute(id: string): Promise<void> {
    return this.deviceRepository.deactivate(id);
  }
}
