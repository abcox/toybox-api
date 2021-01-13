import mongoose, { Schema } from "mongoose";
import { BaseSchema } from '../../helpers/base-schema';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export const ContactSchema = new BaseSchema({
  name: String,
  email: String,
  phone: String
});

export const ContactSchema2 = new Schema({
  name: String,
  email: String,
  phone: String
}).plugin(() => aggregatePaginate);

//.plugin(() => aggregatePaginate);

export const ContactSchema3 = new BaseSchema({
  name: {
    type: String,
    required: "Name is required"
  },
  email: {
    type: String,
    required: "Email is required"
  },
  phone: {
    type: String,
    required: "Phone is required"
  },
  createdOn: {
    type: Date,
    required: true
  }/* ,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  } */
});
