import { CommercialInquiry } from '../domain/model/commercial-inquiry.entity';
import { SubmitCommercialInquiryCommand } from '../domain/model/submit-commercial-inquiry.command';
import { CommercialInquiryResource } from './commercial-inquiries.response';
export class CommercialInquiryAssembler {
  toRequest(command: SubmitCommercialInquiryCommand): SubmitCommercialInquiryCommand {
    return {
      fullName: command.fullName.trim(),
      email: command.email.trim(),
      phoneNumber: command.phoneNumber?.trim() || null,
      companyName: command.companyName.trim(),
      message: command.message.trim(),
    };
  }
  toEntity(resource: CommercialInquiryResource): CommercialInquiry {
    return new CommercialInquiry(
      resource.id,
      this.toRequest(resource),
      new Date(resource.submittedAt),
    );
  }
}
