import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { OrdersService } from './orders.service';
@ApiTags('orders') @Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}
  @Post('checkout') @UseGuards(OptionalJwtGuard) @ApiBearerAuth()
  checkout(@Req() req: Request) { return this.orders.checkout(((req as any).user as { id: string } | undefined)?.id ?? null); }
  @Get() @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  getOrders(@CurrentUser() u: { id: string }) { return this.orders.getOrders(u.id); }
}
