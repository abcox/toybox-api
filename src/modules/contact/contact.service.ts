import { Model, Types } from 'mongoose';
import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Contact } from './interfaces/contact.interface';
import { ContactDto } from './dto/contact.dto';
import { debug } from 'console';

@Injectable()
export class ContactService {
  constructor(
    @Inject('CONTACT_MODEL')
    private contactModel: Model<Contact>,
  ) {}

  async create(createContactDto: ContactDto): Promise<Contact> {
    const createdContact = new this.contactModel(createContactDto);
    return createdContact.save();
  }

  async delete(id: string): Promise<string> {
    try {
      await this.contactModel.findByIdAndRemove(id).exec();
      return `Contact deleted where id = ${id}`;
    } catch (err) {
      debug(err);
      return `Contact delete failed where id = ${id}`;
    }
  }

  // todo: provide filtered pagination..
  async getAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }

  async getById(id: string): Promise<Contact> {
    let item = null;
    try {
      item = await this.contactModel.findById(id).exec();
      if (!item?._id) { 
        throw new BadRequestException(`Item not found for id: ${id}`);
      }
    } catch(err) {
      throw new InternalServerErrorException(err.message);
    }
    return item;
  }
  
  async update(id: string, update: ContactDto): Promise<Contact> {
    const item = await this.contactModel.findById(id).exec();
    if (!item?._id) {
      const msg = `Item not found for id: ${id}`
      debug(msg);
      throw new BadRequestException(msg);
    }
    await this.contactModel.findByIdAndUpdate(id, update).exec();
    return await this.contactModel.findById(id).exec();
  }
}