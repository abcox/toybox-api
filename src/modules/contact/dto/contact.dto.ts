import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class ContactDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsInt()
    readonly email: string;

    @ApiProperty()
    @IsString()
    readonly phone: string;
}