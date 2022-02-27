import { AggregatePaginateModel, AggregatePaginateResult, Connection, Model, Types, Mongoose } from 'mongoose';
import { Injectable, Inject, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { IContact, ContactCreateResponse, ContactDeleteResponse, ContactSearchResponse } from './interfaces/contact.interface';
import { ContactDto } from './dto/contact.dto';
import { Response, Request, SortDirection } from 'src/common/interfaces/base-response-interfaces';
import { ApiResponse } from '@nestjs/swagger';
import { MongoPagination } from '@algoan/nestjs-pagination';
//import { ContactPagedModel } from './contact.provider';
import { InjectConnection } from '@nestjs/mongoose';
import { Doc } from 'prettier';
import { ContactSchema2 } from './contact.schema';
import { inspect } from 'util';

const entityDisplayName = "Contact";
const defaults = {
  paging: {
    limit: 10,
    start: 0
  }
};

//type SampleModel<T extends Document> = PaginateModel<T>;
type ContactPagedModel<T extends Document> = AggregatePaginateModel<IContact>;

@Injectable()
export class ContactService {
  constructor(    
    //@InjectConnection('DATABASE_CONNECTION') private connection: Connection,
    @Inject('CONTACT_MODEL')
    private contactModel: Model<IContact>,
    /* @Inject('CONTACT_PAGED_MODEL')
    private contactPagedModel: ContactPagedModel<Document & IContact>, */
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

  // todo: deprecate (and defer to search..)
  async getAll2({ search, options }): Promise<IContact[]> {
    /* const resultsPerPage = 5;
    const page = req.params.page >= 1 ? req.params.page : 1;
    const query = req.query.search; */
    
    Logger.log(`options: ${options}`);
  
    let { itemsPerPage, page } = JSON.parse(options);
    Logger.log(`itemsPerPage: ${itemsPerPage}`);
    Logger.log(`page: ${page}`);
    itemsPerPage = itemsPerPage > 5 ? itemsPerPage : 5;

    Logger.log(`itemsPerPage: ${itemsPerPage}`);

    let items = this.contactModel
      .find()
      //.find({ name: query })
      //.select("name")
      //.sort({ name: "asc" })
      .limit(itemsPerPage)
      .skip(itemsPerPage * --page)
      .exec();
      
    return items;
  }

  count = async () => await this.contactModel.countDocuments();

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

  // https://stackoverflow.com/questions/48305624/how-to-use-mongodb-aggregation-for-pagination (facets)
  // https://doug-martin.github.io/nestjs-query/

  async search(optionsIn: MongoPagination): Promise<any> {
    
    Logger.log('optionsIn: ', JSON.stringify(optionsIn));
    
    //const contactPagedModel2: ContactPagedModel<IContact & Document> = this.connection.model<IContact>('Contact', ContactSchema2) as ContactPagedModel<IContact & Document>;
    //const contactPagedModel2: any = this.connection.model('Contact', ContactSchema2);

    const { filter, limit, skip, sort } = optionsIn;
    //const { limit, start } = paging;
    //const skip = limit * start;
    //const sort = sorting.map((name, direction) => `${direction===SortDirection.Descending ? "-" : ""}${name} `).toString().trimEnd();

    //PAGINATION -- set the options for pagination
    const options = {
      page: skip || defaults.paging.start,
      collation: { locale: "en" },
      customLabels: {
        totalDocs: "totalItems",
        docs: "items"
      }
    };

    let aggregateOptions = [];
    
    //2
    //LOOKUP/JOIN -- SECOND STAGE
    //FIRST JOIN  -- Category ===================================
    // Here we use $lookup(aggregation) to get the relationship from event to categories (one to many).
    aggregateOptions.push({
      $lookup: {
        from: "contacts",
        localField: "name",
        foreignField: "_id",
        as: "contacts"
      }
    });
    //deconstruct the $contacts array using $unwind(aggregation).
    aggregateOptions.push({$unwind: {path: "$contacts", preserveNullAndEmptyArrays: true}});

    //4
    //FILTER BY DATE -- FOURTH STAGE
    aggregateOptions.push({
        $match: {"start_date": {$gte: new Date()}}
    });

    //5
    //SORTING -- FIFTH STAGE - SORT BY DATE
    aggregateOptions.push({
        $sort: {"start_date": -1, "_id": -1}
    });

    //SELECT FIELDS
    aggregateOptions.push({
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

    aggregateOptions.push({
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
    
    /* return await this.contactPagedModel.aggregatePaginate(
      this.contactPagedModel2.aggregate(aggregateOptions),
      options
      ); */
    /* return await contactPagedModel2.aggregatePaginate(
      contactPagedModel2.aggregate(aggregateOptions),
      options
      ); */


    // Review:
    // https://mongoplayground.net/
    // https://dev.to/max_vynohradov/the-right-way-to-make-advanced-and-efficient-mongodb-pagination-16oa
    // https://stackoverflow.com/questions/59975487/how-do-i-filter-by-a-subdocument-substring-using-indexofcp

    const filter2 = { input: "$name", as: "name", cond: { $eq: [ "Adam" ] } };

    let pipeline2 = [];

    let match = {
      '$match': {
        $expr: {
          $or: [
            {
              '$regexMatch': {
                'input': '$name',
                'regex': filter || '',
                'options': 'i'
              }
            },
            {
              '$regexMatch': {
                'input': '$email',
                'regex': filter || '',
                'options': 'i'
              }
            },
            {
              '$regexMatch': {
                'input': '$phone',
                'regex': filter || '',
                'options': 'i'
              }
            }
          ]
        }
      }
    };    
    pipeline2.push(match);

    //console.log("sort: ", sort);
    if (sort!==undefined) {
      pipeline2.push({'$sort':sort});
    }

    let facet = {
      '$facet': {
        /* total: [{
          $count: 'createdAt'
        }], */
        //metadata: [{ $count: "total" }, { $addFields: { page: NumberInt(3) } }],
        docs: [
          //{ $skip: 0 }, { $limit: 10 } // add projection here wish you re-shape the docs
          {
            $addFields: {
              //_id: '$_id',
              id: '$_id'
            },
          },
          { $skip: skip }, { $limit: limit }
        ],
        meta: [ { $count: 'total' } ]
      }
    }
    pipeline2.push(facet);

    let project = {
      $project: {
        /* docs: {
          $slice: ['$data', skip, {
            $ifNull: [limit, '$total.createdAt']
          }],
        }, */
        docs: 1, //{ $arrayElemAt: [ '$docs', 0 ] },
        //name: 1,
        meta: {
          total: { $arrayElemAt: [ '$meta.total', 0 ] },
          limit: {
            $literal: limit
          },
          page: {
            $literal: ((skip / limit) + 1)
          },
          /* pages: {
            $ceil: {
              $divide: ['$meta.total', limit]
            }
          }, */
        }
      }
    };
    pipeline2.push(project);
    pipeline2.push({
      $unwind: '$meta'
    });

    let pipeline = [
      //{ '$match' : { "_id" : new Types.ObjectId("6003b1b61af92c53c410936f") } },
      //{ '$match' : { ...filter2, active: true } },
      {
        '$match': {
          $expr: {
            $or: [
              {
                '$regexMatch': {
                  'input': '$name',
                  'regex': filter || '',
                  'options': 'i'
                }
              },
              {
                '$regexMatch': {
                  'input': '$email',
                  'regex': filter || '',
                  'options': 'i'
                }
              },
              {
                '$regexMatch': {
                  'input': '$phone',
                  'regex': filter || '',
                  'options': 'i'
                }
              }
            ]
          }
        }
      },/* 
      {
        $lookup: {
          from: 'contacts',
          localField: 'contactId',
          foreignField: '_id',
          as: 'contact',
        },
      }, */
      /* {
        $unwind: {
          path: '$contact',
          preserveNullAndEmptyArrays: true,
        },
      }, */
      {
        $sort: { name: 1 }
      },
      {
        '$facet': {
          /* total: [{
            $count: 'createdAt'
          }], */
          //metadata: [{ $count: "total" }, { $addFields: { page: NumberInt(3) } }],
          docs: [
            //{ $skip: 0 }, { $limit: 10 } // add projection here wish you re-shape the docs
            {
              $addFields: {
                //_id: '$_id',
                id: '$_id'
              },
            },
            { $skip: skip }, { $limit: limit }
          ],
          meta: [ { $count: 'total' } ]
        }
      },
      /* {
        $unwind: '$total'
      }, */
      {
        $project: {
          /* docs: {
            $slice: ['$data', skip, {
              $ifNull: [limit, '$total.createdAt']
            }],
          }, */
          docs: 1, //{ $arrayElemAt: [ '$docs', 0 ] },
          //name: 1,
          meta: {
            total: { $arrayElemAt: [ '$meta.total', 0 ] },
            limit: {
              $literal: limit
            },
            page: {
              $literal: ((skip / limit) + 1)
            },
            /* pages: {
              $ceil: {
                $divide: ['$meta.total', limit]
              }
            }, */
          }
        }
      },
      {
        $unwind: '$meta'
      },
    ];

    //pipeline.push({ $sort: { name: 1 } });
    const results = [...await this.contactModel.aggregate<any>(pipeline2)][0];
    console.log("results: ", results);

      
    /* const pipeline = (filter = {}, skip = 0, limit = 10, sort = {}) => [{
      $match: {
        ...filter,
        active: true,
      }
    },
    {
      $sort: {
        ...sort,
        createdAt: -1,
      }
    },
    {
      $lookup: {
        from: 'statistic',
        localField: '_id',
        foreignField: 'driverId',
        as: 'driver',
      },
    },
    {
      $unwind: {
        path: '$driver',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        driver: {
          $ifNull: [{
            $concat: ['$driver.firstName', ' ', '$driver.lastName']
          }, 'Technical']
        },
        entityId: 1,
        message: 1,
        meta: 1,
        createdAt: 1,
      },
    },
    {
      $facet: {
        total: [{
          $count: 'createdAt'
        }],
        data: [{
          $addFields: {
            _id: '$_id'
          }
        }],
      },
    },
    {
      $unwind: '$total'
    },
    {
      $project: {
        data: {
          $slice: ['$data', skip, {
            $ifNull: [limit, '$total.createdAt']
          }]
        },
        meta: {
          total: '$total.createdAt',
          limit: {
            $literal: limit
          },
          page: {
            $literal: ((skip / limit) + 1)
          },
          pages: {
            $ceil: {
              $divide: ['$total.createdAt', limit]
            }
          },
        },
      },
    },
    ];
    const executePipeline = async () => {
      return this.contactModel.aggregate(pipeline());
    }; */

    const testDocs = [{
      email: 'test@gmail.com',
      phone: '555-1234',
      name: 'Test User',
    } as IContact];

    // test
    const resp = new Promise<AggregatePaginateResult<IContact>>((resolve, reject) => {
      let ret: AggregatePaginateResult<IContact> = {
        docs: results,
        totalDocs: 1,
        limit: 10,
        totalPages: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        //...results
      };
      resolve(ret);
    });
      
    return results;
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
      item = await this.contactModel.findByIdAndUpdate(id, update, { new: true }).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    return item;
  }
}