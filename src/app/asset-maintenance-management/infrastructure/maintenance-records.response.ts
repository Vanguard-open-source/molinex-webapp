import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { MaintenanceType } from '../domain/model/maintenance-type';

export interface MaintenanceRecordsResponse extends BaseResponse {
  maintenanceRecords: MaintenanceRecordResource[];
}

export interface MaintenanceRecordResource extends BaseResource<number> {
  machineId: number;
  type: MaintenanceType;
  performedAt: string;
  description: string;
  responsiblePrincipalId: number;
  responsibleDisplayName: string;
  anomalyId: number | null;
  failure: string | null;
  cause: string | null;
  actionTaken: string | null;
  downtimeMinutes: number | null;
}
