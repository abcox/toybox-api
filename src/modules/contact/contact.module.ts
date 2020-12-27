import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { contactProvider } from './contact.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactController],
  providers: [
    ContactService,
    ...contactProvider,
  ],
})
export class ContactModule {}