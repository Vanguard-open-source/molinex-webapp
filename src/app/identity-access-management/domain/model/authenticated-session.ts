import { User } from './user.entity';
export interface AuthenticatedSession {
  readonly user: User;
  readonly token: string;
}
