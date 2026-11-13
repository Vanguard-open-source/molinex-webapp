import { AuthenticatedSession } from '../domain/model/authenticated-session';
import { SignInCommand } from '../domain/model/sign-in.command';
import { User } from '../domain/model/user.entity';
import { SignInResponse } from './sign-in.response';

export class SignInAssembler {
  toRequest(command: SignInCommand): SignInCommand {
    return { email: command.email.trim(), password: command.password };
  }

  toSession(response: SignInResponse): AuthenticatedSession {
    // The token response has no fullName; show its email instead of inventing a profile.
    return {
      user: new User(response.id, response.email, '', [response.role]),
      token: response.token,
    };
  }
}
