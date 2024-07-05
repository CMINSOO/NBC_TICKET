import { Column, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../types/userRole.type';
import { Booking } from 'src/booking/entities/booking.entity';

//@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true})
  email: string;

  @Column({type: 'varchar', unique: true, nullable: false})
  nickname:string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({type: 'int', default: 1000000 })
  point: number;

  @OneToMany(()=> Booking, (bookings) => bookings.user)
  bookings: Booking
}