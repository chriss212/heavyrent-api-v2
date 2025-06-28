import { Machine } from '../../machines/machine.entity/machine.entity';
import { User } from '../../users/user.entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class RentalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.rentals, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Machine, (machine) => machine.rentals, { eager: false })
  @JoinColumn({ name: 'machineId' })
  machine: Machine;
}
