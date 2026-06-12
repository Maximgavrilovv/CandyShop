import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candy } from './candy.entity';
import { CandiesService } from './candies.service';
import { CandiesController } from './candies.controller';
@Module({ imports: [TypeOrmModule.forFeature([Candy])], providers: [CandiesService], controllers: [CandiesController], exports: [CandiesService] })
export class CandiesModule {}
