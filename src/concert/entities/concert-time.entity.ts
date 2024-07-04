import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Concert } from './concert.entity';

@Entity({
  name: 'concerttime',
})
export class ConcertTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true, nullable: false })
  concertid: Concert;

  @Column({type: 'datetime', nullable:false})
  concert_time : Date;

  @Column({type:'int', nullable:false})
  seat : number;

  @ManyToOne(() => Concert, (concert)=> concert.concerttimes)
  concert:Concert;
}