import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Role } from './role';

export class User implements BaseEntity<number> {
  constructor(
    public id: number,
    readonly email: string,
    readonly fullName: string,
    readonly roles: readonly Role[],
    readonly status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' = 'ACTIVE',
  ) {}

  get displayName(): string {
    return this.fullName || this.email;
  }
}
