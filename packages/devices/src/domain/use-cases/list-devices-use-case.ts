import type { DeviceRepository } from '../repositories/device-repository';

export class ListDevicesUseCase {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  execute() {
    return this.deviceRepository.list();
  }
}
