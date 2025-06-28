import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/user.entity/user.entity';
import { RentalRequest } from '../../rentals/rental-request.entity/rental-request.entity';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => User, (user) => user.machines)
  createdBy: User;

  @OneToMany(() => RentalRequest, (rental) => rental.machine)
  rentals: RentalRequest[];
}
