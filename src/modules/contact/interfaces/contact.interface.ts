import { BaseResponse } from "../../../common/interfaces/base-response-interfaces";
import { Document } from 'mongoose';

export interface IContact extends Document {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
}

export interface ContactDeleteResponse extends BaseResponse {    
    readonly id: string;
}

export interface ContactCreateResponse extends BaseResponse {    
    readonly item: IContact;
}

/* export interface ContactSort {
    readonly items: Array<SortMeta>
} */

export interface ContactSearchResponse {
    items: IContact[];
    itemTotal: number;
}