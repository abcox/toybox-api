import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import {
  //contactPagedProvider,
  contactProvider } from './contact.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactController],
  providers: [
    ContactService,
    ...contactProvider,
    //...contactPagedProvider,
  ],
})
export class ContactModule {}