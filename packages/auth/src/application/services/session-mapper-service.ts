import type { SessionDto } from '../dto/session-dto';
import { createSession, type Session } from '../../domain/entities/user';

export class SessionMapperService {
  toDto(session: Session): SessionDto {
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken ?? null,
      expiresAt: session.expiresAt ?? null,
      user: {
        id: session.user.id,
        firebaseUid: session.user.firebaseUid,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        isActive: session.user.isActive,
        lastLoginAt: session.user.lastLoginAt ?? null,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      },
    };
  }

  toDomain(session: SessionDto): Session {
    return createSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken ?? null,
      expiresAt: session.expiresAt ?? null,
      user: session.user,
    });
  }
}
