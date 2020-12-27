import { Connection } from 'mongoose';
import { ContactSchema } from './contact.schema';

export const contactProvider = [
  {
    provide: 'CONTACT_MODEL',
    useFactory: (connection: Connection) => connection.model('Contact', ContactSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];