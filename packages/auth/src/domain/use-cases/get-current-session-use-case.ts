import type { Session } from '../entities/user';
import type { AuthRepository } from '../repositories/auth-repository';

export class GetCurrentSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<Session | null> {
    return this.authRepository.getSession();
  }
}
