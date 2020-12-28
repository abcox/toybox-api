import { Model, Types } from 'mongoose';
import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Contact, ContactCreateResponse, ContactDeleteResponse } from './interfaces/contact.interface';
import { ContactDto } from './dto/contact.dto';
import { debug } from 'console';

const entityDisplayName = "Contact";

@Injectable()
export class ContactService {
  constructor(
    @Inject('CONTACT_MODEL')
    private contactModel: Model<Contact>,
  ) {}

  async create(createContactDto: ContactDto): Promise<ContactCreateResponse> {
    /* const createdContact = new this.contactModel(createContactDto);
    return createdContact.save(); */
    //return new this.contactModel(createContactDto).save();
    let result: ContactCreateResponse;
    const createdContact = new this.contactModel(createContactDto);
    try {
      result = {
        message: `${entityDisplayName} created`,
        item: await new this.contactModel(createContactDto).save()
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    return result;
  }

  async delete(id: string): Promise<ContactDeleteResponse> {
    let result: ContactDeleteResponse;
    /* if (!Types.ObjectId.isValid(id)) {
      throw new InternalServerErrorException(`Invalid id ${id}`);   // todo: look into validation via middle-ware
    } */
    try {
      let doc = await this.contactModel.findByIdAndRemove(id).exec()
      if (!doc) {
        throw new InternalServerErrorException(`Contact not found with id = ${id}`);
      }
      result = { message: `${entityDisplayName} deleted`, id: doc.id };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    return result;
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
        throw new BadRequestException(`${entityDisplayName} not found for id: ${id}`);
      }
    } catch(err) {
      throw new InternalServerErrorException(err.message);
    }
    return item;
  }
  
  async update(id: string, update: ContactDto): Promise<Contact> {
    let item;
    try {
      item = await this.contactModel.findByIdAndUpdate(id, update, { returnOriginal: false }).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    return item;
  }
}