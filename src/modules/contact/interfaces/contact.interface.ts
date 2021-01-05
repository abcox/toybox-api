import { BaseResponse } from "../../../common/interfaces/base-response-interfaces";
import { Document } from 'mongoose';

export interface Contact extends Document {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
}

export interface ContactDeleteResponse extends BaseResponse {    
    readonly id: string;
}

export interface ContactCreateResponse extends BaseResponse {    
    readonly item: Contact;
}

/* export interface ContactSort {
    readonly items: Array<SortMeta>
} */