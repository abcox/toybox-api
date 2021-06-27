import mongoose, { Connection, AggregatePaginateResult, model, AggregatePaginateModel } from "mongoose";
import { ContactSchema, ContactSchema2 } from "./contact.schema";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IContact } from "./interfaces/contact.interface";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// notice plugin setup:
//ContactSchema.plugin(mongooseAggregatePaginate);
//ContactSchema.plugin(() => aggregatePaginate);

// is this correct ?
//interface ContactModel<T extends Document> extends AggregatePaginateResult<T> {}

//export type ContactPagedModel<T extends Document> = AggregatePaginateModel<IContact>;

// how to create model for factory use ?
//export const ContactModel: ContactModel<any> = model<IContact>('Contact', ContactSchema) as ContactModel<IContact>;

export const contactProvider = [
  {
    provide: 'CONTACT_MODEL',
    useFactory: (connection: Connection) => connection.model('Contact', ContactSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

/* export const contactPagedProvider = [
  {
    provide: 'CONTACT_PAGED_MODEL',
    useFactory: (connection: Connection) => {
      // how to instantiate model ?
      //connection.plugin(() => aggregatePaginate);
      let model = connection.model<IContact>('Contact', ContactSchema2) as ContactPagedModel<Document & IContact>;
      return model;
    },
    inject: ['DATABASE_CONNECTION'],
  },
]; */