import { Document } from 'mongoose';

export interface Contact extends Document {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
}