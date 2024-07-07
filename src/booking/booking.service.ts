import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Concert } from 'src/concert/entities/concert.entity';
import { ConcertService } from 'src/concert/concert.service';
import { UserService } from 'src/user/user.service';
import { ConcertTime } from 'src/concert/entities/concert-time.entity';
import { Status } from './types/status.type';
import { User } from 'src/user/entities/user.entitiy';
import _ from 'lodash';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(Concert)
        private concertRepository:Repository<Concert>,
        private readonly concertService:ConcertService,
        private readonly userService:UserService,
        @InjectRepository(ConcertTime)
        private concerttimeRepository: Repository<ConcertTime>,
        private dataSource:DataSource,
    ) {}

  async createBooking(createBookingDto:CreateBookingDto, user: User):Promise<Booking>{
        const {concertId, concertTimeId, price } = createBookingDto
        const concert = await this.concertRepository.findOne({where:{id:concertId}});
        if(!concert){
            throw new NotFoundException('공연을 찾을수 없습니다');
        }

        const concertTime = await this.concerttimeRepository.findOne({where:{id:concertTimeId}});
        if(!concertTime){
            throw new NotFoundException('공연시간을 찾을수 없습니다');
        }
        if(concertTime.seat <= 0){
            throw new BadRequestException('예약 가능한 좌석이 없습니다.')
        }

    
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
          await this.userService.deductBalance(user, price, queryRunner);
          concertTime.seat -= 1;
          await queryRunner.manager.save(concertTime);
          console.log(concertId, concertTimeId)
          const newBookingData = {
            userid: user.id,
            concertid: concertId,
            concerttimeid: concertTimeId,
            price,
            status: Status.BOOKED, // 기본 상태
          };
          const newBooking = this.bookingRepository.create(newBookingData);
          console.log(newBookingData)
          await queryRunner.manager.save(newBooking);
          await queryRunner.commitTransaction();
          return newBooking;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new InternalServerErrorException('트랜잭션 실패');
        } finally {
          await queryRunner.release();
        }

     }
     
     async findBooking(id:number){
        const booking = await this.bookingRepository.findOneBy({id});
        if (_.isNil(booking)){
          throw new NotFoundException('존재하지 않는 예약건입니다.')
        }
        return booking
     }
}
