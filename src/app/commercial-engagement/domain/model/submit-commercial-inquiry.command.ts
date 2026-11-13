export interface SubmitCommercialInquiryCommand {
  readonly fullName: string;
  readonly email: string;
  readonly phoneNumber: string | null;
  readonly companyName: string;
  readonly message: string;
}
