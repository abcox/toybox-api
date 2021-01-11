import mongoose from "mongoose";
import { BaseSchema } from '../../helpers/base-schema';

export const ContactSchema = new BaseSchema({
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
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});
