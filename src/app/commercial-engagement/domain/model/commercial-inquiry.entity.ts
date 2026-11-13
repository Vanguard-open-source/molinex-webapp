import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { SubmitCommercialInquiryCommand } from './submit-commercial-inquiry.command';
export class CommercialInquiry implements BaseEntity<number> {
  constructor(
    public id: number,
    readonly contact: SubmitCommercialInquiryCommand,
    readonly submittedAt: Date,
  ) {}
}
