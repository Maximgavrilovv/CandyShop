import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CartService } from './cart.service';
import { AddToCartDto } from './cart.dto';
@ApiTags('cart') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}
  @Get() getCart(@CurrentUser() u: { id: string }) { return this.cart.getCart(u.id); }
  @Post('items') addItem(@CurrentUser() u: { id: string }, @Body() dto: AddToCartDto) { return this.cart.addItem(u.id, dto); }
  @Delete('items/:id') removeItem(@CurrentUser() u: { id: string }, @Param('id') id: string) { return this.cart.removeItem(u.id, id); }
}
