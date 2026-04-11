import type { Session } from '../entities/user';
import type { AuthRepository, SignInPayload } from '../repositories/auth-repository';

export class SignInUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(payload: SignInPayload): Promise<Session> {
    return this.authRepository.signIn(payload);
  }
}

