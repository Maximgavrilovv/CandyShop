import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CandiesService } from './candies.service';
// No auth guard — catalog is public
@ApiTags('candies')
@Controller('candies')
export class CandiesController {
  constructor(private readonly candies: CandiesService) {}
  @Get() findAll() { return this.candies.findAll(); }
  @Get(':id') async findOne(@Param('id') id: string) {
    const c = await this.candies.findOne(id);
    if (!c) throw new NotFoundException('Candy not found');
    return c;
  }
}
