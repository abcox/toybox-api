    import mongoose, { Connection, AggregatePaginateResult, model } from "mongoose";
    import { ContactSchema } from "./contact.schema";
    import aggregatePaginate from "mongoose-aggregate-paginate-v2";
    import { IContact } from "./interfaces/contact.interface";

    // notice plugin setup:
    ContactSchema.plugin(aggregatePaginate);

    // is this correct ?
    interface ContactModel<T extends Document> extends AggregatePaginateResult<T> {}

    // how to create model for factory use ?
    export const ContactModel: ContactModel<any> = model<IContact>('Contact', ContactSchema) as ContactModel<IContact>;

    export const contactProvider = [
      {
        provide: 'CONTACT_MODEL',
        useFactory: (connection: Connection) => {
          // how to instantiate model ?
          let model = connection.model<ContactModel<any>>('Contact', ContactSchema);
          return model;
        },
        inject: ['DATABASE_CONNECTION'],
      },
    ];