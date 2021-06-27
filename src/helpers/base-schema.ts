import { Schema } from "mongoose";
//import { Paginate } from "mongoose-paginate-v2";

export class BaseSchema extends Schema// implements Paginate
{
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
};
