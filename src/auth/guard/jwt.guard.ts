import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('JWT') {
  constructor() {
    super();
  }
}
