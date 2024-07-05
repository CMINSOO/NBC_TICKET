import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Concert } from './concert.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity({
  name: 'concerttime',
})
export class ConcertTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'datetime', nullable:false})
  concert_time : Date;

  @Column({type:'int', nullable:false})
  seat : number;

  @ManyToOne(() => Concert, (concert)=> concert.concerttimes)
  @JoinColumn({name:'concertid' })
  concert:Concert; 

  @OneToMany(() => Booking, (bookings)=> bookings.concerttime)
  bookings:Booking
}