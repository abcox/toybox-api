import { Document } from 'mongoose';

export interface Contact extends Document {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
}

export interface BaseResponse {
    readonly message: string;
}

export interface ContactDeleteResponse extends BaseResponse {    
    readonly id: string;
}

export interface ContactCreateResponse extends BaseResponse {    
    readonly item: Contact;
}