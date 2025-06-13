import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateMachineDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Excavator', description: 'Name of the machine'})
    name: string

    @IsString()
    @MinLength(10)
    @ApiProperty({ example: 'Caterpillar', description: 'Brand and functions of the machine'})
    description: string
}