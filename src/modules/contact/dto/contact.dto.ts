import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ContactDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly email: string;

    @ApiProperty()
    @IsString()
    readonly phone: string;
}