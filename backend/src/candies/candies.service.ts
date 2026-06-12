import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candy } from './candy.entity';
@Injectable()
export class CandiesService {
  constructor(@InjectRepository(Candy) private readonly candies: Repository<Candy>) {}
  findAll(): Promise<Candy[]> { return this.candies.find({ order: { name: 'ASC' } }); }
  findOne(id: string): Promise<Candy | null> { return this.candies.findOneBy({ id }); }
}
