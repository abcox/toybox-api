import { Model, Types } from 'mongoose';
import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IContact, ContactCreateResponse, ContactDeleteResponse, ContactSearchResponse } from './interfaces/contact.interface';
import { ContactDto } from './dto/contact.dto';
import { Response, Request, SortDirection } from 'src/common/interfaces/base-response-interfaces';

const entityDisplayName = "Contact";
const defaults = {
  paging: {
    limit: 10,
    start: 0
  }
};

@Injectable()
export class ContactService {
  constructor(
    @Inject('CONTACT_MODEL')
    private contactModel: Model<IContact>,
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
  async getAll(): Promise<IContact[]> {
    return this.contactModel.find().exec();
  }

  // todo: finish this.. (also change client to support server-side paging & sorting..)
  // todo: provide filtered pagination..
  // todo: ref: https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js
  // todo: ref: https://stackoverflow.com/questions/59680710/vuetify-server-side-paginated-datatable-does-not-sort-client-side
  // todo: ref: https://vuetifyjs.com/en/components/data-tables/#server-side-paginate-and-sort

  // https://stackoverflow.com/questions/34482136/mongoose-the-typescript-way
  // https://jasonching2005.medium.com/complete-guide-for-using-typescript-in-mongoose-with-lean-function-e55adf1189dc
  // https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
  // https://github.com/MosesEsan/mesan-nodejs-crud-api-with-pagination-filtering-grouping-and-sorting-capabilities/blob/master/src/controllers/event.js
  // https://medium.com/swlh/node-js-api-add-crud-operations-with-pagination-filtering-grouping-and-sorting-capabilities-55375ad0b774
  async search(optionsIn: Request<IContact>): Promise<Response<IContact[]>> {
    const { filter, paging, sorting } = optionsIn;
    const { limit, start } = paging;
    const skip = limit * start;
    const sort = sorting.map((name, direction) => `${direction===SortDirection.Descending ? "-" : ""}${name} `).toString().trimEnd();

    let aggregate_options = [];

    //PAGINATION -- set the options for pagination
    const options = {
      page: start || defaults.paging.start,
      collation: { locale: "en" },
      customLabels: {
        totalDocs: "totalItems",
        docs: "items"
      }
    };

    //2
    //LOOKUP/JOIN -- SECOND STAGE
    //FIRST JOIN  -- Category ===================================
    // Here we use $lookup(aggregation) to get the relationship from event to categories (one to many).
    aggregate_options.push({
      $lookup: {
        from: "contacts",
        localField: "name",
        foreignField: "_id",
        as: "contacts"
      }
    });
    //deconstruct the $contacts array using $unwind(aggregation).
    aggregate_options.push({$unwind: {path: "$contacts", preserveNullAndEmptyArrays: true}});

    //4
    //FILTER BY DATE -- FOURTH STAGE
    aggregate_options.push({
        $match: {"start_date": {$gte: new Date()}}
    });

    //5
    //SORTING -- FIFTH STAGE - SORT BY DATE
    aggregate_options.push({
        $sort: {"start_date": -1, "_id": -1}
    });

    //SELECT FIELDS
    aggregate_options.push({
        $project: {
            _id: 1,
            createdBy: 1,
            createdOn: 1,
            email: 1,
            name: 1,
            phone: 1,
            /* category: { $ifNull: [ "$categories._id", null ] },
            category_name: { $ifNull: [ "$categories.name", null ] },
            image: 1,
            createdAt: 1 */
        }
    });

    aggregate_options.push({
        $sample: { size: skip || defaults.paging.start }
    });

    /* let results2 = this.contactModel
      .find({filter})
      .limit(limit||defaults.paging.limit)
      .skip(skip||defaults.paging.start)
      .sort(sort)
      .exec();
    let results = this.contactModel.paginate({}, options, function(err, result){
    }); */

    
    // Set up the aggregation
    const myAggregate = this.contactModel.aggregate(aggregate_options);
    const result = await this.contactModel.aggregatePaginate(myAggregate, options);

    return result.events;
  }

  async getById(id: string): Promise<IContact> {
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
  
  async update(id: string, update: ContactDto): Promise<IContact> {
    let item;
    try {
      item = await this.contactModel.findByIdAndUpdate(id, update, { returnOriginal: false }).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    return item;
  }
}