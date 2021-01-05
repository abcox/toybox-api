import { Model, Types } from 'mongoose';
import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Contact, ContactCreateResponse, ContactDeleteResponse } from './interfaces/contact.interface';
import { ContactDto } from './dto/contact.dto';
import { BaseRequestOptions, SortDirection } from 'src/common/interfaces/base-response-interfaces';

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
        meta: {
          status: {
            message: `${entityDisplayName} created`,
            color: "success"  
          }
        },
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
      result = { 
        meta: {
          status: {
            message: `${entityDisplayName} deleted`,
            color: "success"  
          }
        },
        id: doc.id
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    return result;
  }

  // todo: deprecate (and defer to search..)
  async getAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }

  // todo: finish this.. (also change client to support server-side paging & sorting..)
  // todo: provide filtered pagination..
  // todo: ref: https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js
  // todo: ref: https://stackoverflow.com/questions/59680710/vuetify-server-side-paginated-datatable-does-not-sort-client-side
  // todo: ref: https://vuetifyjs.com/en/components/data-tables/#server-side-paginate-and-sort
  async search(filter: Contact, { paging, sorting }: BaseRequestOptions): Promise<Contact[]> {
    const { limit, start } = paging;
    const skip = limit * start;
    const sort = sorting.map((name, direction) => `${direction===SortDirection.Descending ? "-" : ""}${name} `).toString().trimEnd();
    return this.contactModel.find({filter}).limit(limit).skip(skip).sort(sort).exec();
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