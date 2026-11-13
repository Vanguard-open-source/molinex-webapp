import { BaseResource } from '../../shared/infrastructure/base-response';
import { SubmitCommercialInquiryCommand } from '../domain/model/submit-commercial-inquiry.command';
export interface CommercialInquiryResource
  extends BaseResource<number>, SubmitCommercialInquiryCommand {
  readonly submittedAt: string;
}
