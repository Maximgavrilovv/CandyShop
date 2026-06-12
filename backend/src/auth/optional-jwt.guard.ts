import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

/**
 * Enforces JWT auth only when CHECKOUT_REQUIRES_AUTH=true (default).
 * When "false", unauthenticated requests pass through; req.user will be undefined.
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  constructor(private readonly config: ConfigService) { super(); }

  canActivate(context: ExecutionContext) {
    const required = this.config.get<string>('CHECKOUT_REQUIRES_AUTH', 'true') !== 'false';
    if (!required) return super.canActivate(context) as any;
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any, _ctx: ExecutionContext, _status?: any) {
    const required = this.config.get<string>('CHECKOUT_REQUIRES_AUTH', 'true') !== 'false';
    if (!required && !user) return null;
    if (err || !user) throw err || new Error('Unauthorized');
    return user;
  }
}
