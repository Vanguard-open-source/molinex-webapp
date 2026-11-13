import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { SignUpResponse } from './sign-up.response';
import { SignUpAssembler } from './sign-up-assembler';

export class SignUpApiEndpoint {
  readonly #assembler = new SignUpAssembler();
  constructor(readonly http: HttpClient) {}

  signUp(command: SignUpCommand) {
    return this.http
      .post<SignUpResponse>(`${environment.apiBaseUrl}/users`, this.#assembler.toRequest(command), {
        observe: 'response',
      })
      .pipe(
        map((response): User => {
          if (response.status !== 201 || !response.body)
            throw new Error('Creation was not confirmed.');
          return this.#assembler.toUser(response.body);
        }),
      );
  }
}
