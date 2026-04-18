import type { Device } from '../entities/device';
import type { DeviceRepository, UpdateDevicePayload } from '../repositories/device-repository';

export class UpdateDeviceUseCase {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  execute(payload: UpdateDevicePayload): Promise<Device> {
    return this.deviceRepository.update(payload);
  }
}
