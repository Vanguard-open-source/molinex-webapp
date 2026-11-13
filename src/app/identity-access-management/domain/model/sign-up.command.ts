import { Role } from './role';
export interface SignUpCommand {
  readonly email: string;
  readonly password: string;
  readonly fullName: string;
  readonly roles: readonly Role[];
}
