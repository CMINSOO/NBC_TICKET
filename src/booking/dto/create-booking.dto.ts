import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: '예약할 공연을 선택해 주세요.' })
  concertId: number;

  @IsNotEmpty({ message: '예약할 시간을 선택해주세요.' })
  concertTimeId: number;

  price:number;
}