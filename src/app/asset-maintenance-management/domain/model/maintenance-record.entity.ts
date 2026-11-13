import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { CorrectiveMaintenanceDetails } from './corrective-maintenance-details';
import { MaintenanceDescription } from './maintenance-description';
import { MaintenanceType } from './maintenance-type';
import { TechnicianReference } from './technician-reference';

export class MaintenanceRecord implements BaseEntity<number> {
  #id: number;
  readonly #machineId: number;
  readonly #type: MaintenanceType;
  readonly #performedAt: Date;
  readonly #description: MaintenanceDescription;
  readonly #responsible: TechnicianReference;
  readonly #anomalyId: number | null;
  readonly #correctiveDetails: CorrectiveMaintenanceDetails | null;

  constructor(props: {
    id: number;
    machineId: number;
    type: MaintenanceType;
    performedAt: Date;
    description: MaintenanceDescription;
    responsible: TechnicianReference;
    anomalyId?: number | null;
    correctiveDetails?: CorrectiveMaintenanceDetails | null;
  }) {
    if (
      !Number.isInteger(props.machineId) ||
      props.machineId <= 0 ||
      Number.isNaN(props.performedAt.getTime())
    ) {
      throw new Error('A valid machine and maintenance date are required.');
    }
    this.#id = props.id;
    this.#machineId = props.machineId;
    this.#type = props.type;
    this.#performedAt = props.performedAt;
    this.#description = props.description;
    this.#responsible = props.responsible;
    this.#anomalyId = props.anomalyId ?? null;
    this.#correctiveDetails = props.correctiveDetails ?? null;
    if (props.type === 'CORRECTIVE' && !this.#correctiveDetails) {
      throw new Error('Corrective maintenance details are required.');
    }
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get machineId(): number {
    return this.#machineId;
  }

  get type(): MaintenanceType {
    return this.#type;
  }

  get performedAt(): Date {
    return this.#performedAt;
  }

  get description(): MaintenanceDescription {
    return this.#description;
  }

  get responsible(): TechnicianReference {
    return this.#responsible;
  }

  get anomalyId(): number | null {
    return this.#anomalyId;
  }

  get correctiveDetails(): CorrectiveMaintenanceDetails | null {
    return this.#correctiveDetails;
  }
}
