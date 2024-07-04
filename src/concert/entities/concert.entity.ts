import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../types/concertCategory.type';
import { ConcertTime } from './concert-time.entity';

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

  @OneToMany(() => ConcertTime, (concerttime) => concerttime.concertid)
  concerttimes: ConcertTime[];  
}