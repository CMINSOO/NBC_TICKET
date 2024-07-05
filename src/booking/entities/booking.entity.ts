import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Concert } from 'src/concert/entities/concert.entity';
import { User } from 'src/user/entities/user.entitiy';
import { ConcertTime } from 'src/concert/entities/concert-time.entity';
import { Status } from '../types/status.type';

//@Index('email', ['email'], { unique: true })
@Entity({
  name: 'bookings',
})
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Concert, (concert) => concert.bookings)
  @JoinColumn({name:'concertid'})
  concert:Concert

  @Column({name:'concertid'})
  concertid:number

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({name:'userid'})
  user:User

  @Column({name:'userid'})
  userid:number

  @ManyToOne(() => ConcertTime, (concerttime) => concerttime.bookings)
  @JoinColumn({name:'concerttimeid'})
  concerttime:ConcertTime

  @Column({name:'concerttimeid'})
  concerttimeid: number

  @Column({type:'int', nullable: false})
  price:number

  @Column({type:'enum', enum: Status, default: Status.BOOKED})
  status:Status

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date
}