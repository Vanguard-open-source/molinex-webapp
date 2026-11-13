import { BaseResource } from '../../shared/infrastructure/base-response';
import { Role } from '../domain/model/role';
export interface SignUpResponse extends BaseResource<number> {
  readonly email: string;
  readonly fullName: string;
  readonly roles: Role[];
  readonly status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
}
