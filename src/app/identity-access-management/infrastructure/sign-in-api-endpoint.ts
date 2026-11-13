import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignInCommand } from '../domain/model/sign-in.command';
import { AuthenticatedSession } from '../domain/model/authenticated-session';
import { SignInResponse } from './sign-in.response';
import { SignInAssembler } from './sign-in-assembler';

export class SignInApiEndpoint {
  readonly #assembler = new SignInAssembler();
  constructor(readonly http: HttpClient) {}

  signIn(command: SignInCommand) {
    return this.http
      .post<SignInResponse>(
        `${environment.apiBaseUrl}/tokens`,
        this.#assembler.toRequest(command),
        { observe: 'response' },
      )
      .pipe(
        map((response): AuthenticatedSession => {
          if (response.status !== 201 || !response.body)
            throw new Error('Creation was not confirmed.');
          return this.#assembler.toSession(response.body);
        }),
      );
  }
}
