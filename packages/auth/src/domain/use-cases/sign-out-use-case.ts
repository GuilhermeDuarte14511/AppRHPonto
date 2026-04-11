import type { AuthRepository } from '../repositories/auth-repository';

export class SignOutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}

