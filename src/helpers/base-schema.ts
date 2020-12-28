import { Schema } from "mongoose";

export class BaseSchema extends Schema {
    constructor(sche: any) {
        super(sche);
        this.set('toJSON', {
            virtuals: true,
            transform: (doc, converted) => {
                delete converted._id;
                delete converted.__v;
            }
        });
    }
}