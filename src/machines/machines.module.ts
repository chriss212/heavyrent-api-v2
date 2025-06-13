import { Module } from '@nestjs/common';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './machine.entity/machine.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [TypeOrmModule.forFeature([Machine]), UsersModule],
  controllers: [MachinesController],
  providers: [MachinesService]
})
export class MachinesModule {}
