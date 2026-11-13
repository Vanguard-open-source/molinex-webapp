import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { SignUpResponse } from './sign-up.response';

export class SignUpAssembler {
  toRequest(command: SignUpCommand): SignUpCommand {
    return {
      email: command.email.trim(),
      password: command.password,
      fullName: command.fullName.trim(),
      roles: [...command.roles],
    };
  }

  toUser(response: SignUpResponse): User {
    return new User(
      response.id,
      response.email,
      response.fullName,
      response.roles,
      response.status,
    );
  }
}
