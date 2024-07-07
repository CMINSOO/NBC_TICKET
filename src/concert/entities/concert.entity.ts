import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../types/concertCategory.type';
import { ConcertTime } from './concert-time.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Status } from '../types/concertStatus.type';

@Entity({
  name: 'concert',
})
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  concertname: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({type: 'enum', enum:Category})
  category: string;

  @Column({type: 'varchar', nullable:false })
  location: string;

  @Column({type: 'int', nullable: false})
  price: number;

  @Column({type: 'varchar', nullable: true})
  poster: string;

  @Column({type: 'enum', enum:Status, default:Status.is_bookable})
  status:Status

  @OneToMany(() => ConcertTime, (concerttime) => concerttime.concert)
  concerttimes: ConcertTime[];  

  @OneToMany(() => Booking, (bookings) => bookings.concert)
  bookings: Booking[];

}