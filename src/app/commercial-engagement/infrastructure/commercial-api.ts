import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SubmitCommercialInquiryCommand } from '../domain/model/submit-commercial-inquiry.command';
import { CommercialInquiriesApiEndpoint } from './commercial-inquiries-api-endpoint';
@Injectable({ providedIn: 'root' })
export class CommercialApi extends BaseApi {
  readonly #inquiries = new CommercialInquiriesApiEndpoint(this.http);
  submit(command: SubmitCommercialInquiryCommand) {
    return this.#inquiries.submit(command);
  }
}
