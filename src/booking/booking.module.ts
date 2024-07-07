import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/user/entities/user.entitiy';
import { Concert } from 'src/concert/entities/concert.entity';
import { ConcertTime } from 'src/concert/entities/concert-time.entity';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConcertService } from 'src/concert/concert.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Booking,User,Concert,ConcertTime]),JwtModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET_KEY'),
    }),
    inject: [ConfigService],
  }),],
  controllers: [BookingController],
  providers: [BookingService,UserService,JwtService, ConcertService]
})
export class BookingModule {}
