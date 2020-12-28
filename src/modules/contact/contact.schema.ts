//import * as mongoose from 'mongoose';
import { BaseSchema } from '../../helpers/base-schema';

export const ContactSchema = new BaseSchema({
  name: String,
  email: String,
  phone: String,
});