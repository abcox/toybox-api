import { IBaseResponse } from "../../../common/interfaces/base-response-interfaces";
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

export interface IContact extends Document {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
}

export interface ContactDeleteResponse extends IBaseResponse {    
    readonly id: string;
}

export interface ContactCreateResponse extends IBaseResponse {    
    readonly item: IContact;
}

/* export interface ContactSort {
    readonly items: Array<SortMeta>
} */

export interface ContactSearchResponse {
    items: IContact[];
    itemTotal: number;
}