import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt } from "class-validator";

export class CreateRentalDto {
    @ApiProperty({ example: '1', description: 'Id of the machine'})
    @IsInt()
    machineId: number // id de machine

    @ApiProperty({ example: '2025-06-01', description: 'Start Date of usage of the machine'})
    @IsDateString()
    startDate: string

    @ApiProperty({ example: '2025-06-10', description: 'End date of usage of the machine'})
    @IsDateString()
    endDate: string
}