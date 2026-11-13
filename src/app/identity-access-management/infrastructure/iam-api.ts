import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignInApiEndpoint } from './sign-in-api-endpoint';
import { SignUpApiEndpoint } from './sign-up-api-endpoint';

@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  readonly #signIn = new SignInApiEndpoint(this.http);
  readonly #signUp = new SignUpApiEndpoint(this.http);
  signIn(command: SignInCommand) {
    return this.#signIn.signIn(command);
  }
  signUp(command: SignUpCommand) {
    return this.#signUp.signUp(command);
  }
}
