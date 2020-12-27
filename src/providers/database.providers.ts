import * as mongoose from 'mongoose';

const dbUri = "mongodb://127.0.0.1:27017";

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      //mongoose.connect('mongodb://localhost/nest'),
      mongoose.connect(dbUri, { useFindAndModify: false }),      
  },
];