import { Document } from 'mongoose';

export interface Contact extends Document {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
}

export interface BaseResponseMetaStatus {
    readonly message: string;
    readonly color: string;
}

export interface BaseResponseMeta {
    readonly status: BaseResponseMetaStatus;
}

export interface BaseResponse {
    readonly meta: BaseResponseMeta;
}

export interface ContactDeleteResponse extends BaseResponse {    
    readonly id: string;
}

export interface ContactCreateResponse extends BaseResponse {    
    readonly item: Contact;
}