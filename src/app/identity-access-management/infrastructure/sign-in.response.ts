import { Role } from '../domain/model/role';
export interface SignInResponse {
  readonly id: number;
  readonly email: string;
  readonly role: Role;
  readonly token: string;
}
