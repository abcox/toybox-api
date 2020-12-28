import * as mongoose from 'mongoose';

const APP_NAME = "vba"
//const dbUri = "mongodb://127.0.0.1:27017";
//const dbUri = "mongodb://localhost:27017/admin"; // todo: clean this collection(??)
//const dbUri = "mongodb://localhost:27017/myapp"; // todo: clean this collection
const dbUri = `mongodb://localhost:27017/${APP_NAME}`; // todo: refactor to use config..

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      //mongoose.connect('mongodb://localhost/nest'),
      mongoose.connect(dbUri, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
  },
];