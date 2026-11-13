import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SubmitCommercialInquiryCommand } from '../domain/model/submit-commercial-inquiry.command';
import { CommercialInquiryResource } from './commercial-inquiries.response';
import { CommercialInquiryAssembler } from './commercial-inquiry-assembler';
export class CommercialInquiriesApiEndpoint {
  readonly #assembler = new CommercialInquiryAssembler();
  constructor(readonly http: HttpClient) {}
  submit(command: SubmitCommercialInquiryCommand) {
    return this.http
      .post<CommercialInquiryResource>(
        `${environment.apiBaseUrl}/commercial-inquiries`,
        this.#assembler.toRequest(command),
        { observe: 'response' },
      )
      .pipe(
        map((response) => {
          if (response.status !== 201 || !response.body)
            throw new Error('Creation was not confirmed.');
          return this.#assembler.toEntity(response.body);
        }),
      );
  }
}
