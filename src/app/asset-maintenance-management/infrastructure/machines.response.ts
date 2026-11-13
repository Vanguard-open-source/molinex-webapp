import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { MachineStatus } from '../domain/model/machine-status';

export interface MachinesResponse extends BaseResponse {
  machines: MachineResource[];
}

export interface MachineResource extends BaseResource<number> {
  code: string;
  name: string;
  model: string;
  status: MachineStatus;
  statusChangedAt: string;
}
