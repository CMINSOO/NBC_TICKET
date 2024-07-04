import { Module } from '@nestjs/common';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { ConcertTime } from './entities/concert-time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert,ConcertTime])],
  controllers: [ConcertController],
  providers: [ConcertService]
})
export class ConcertModule {}
