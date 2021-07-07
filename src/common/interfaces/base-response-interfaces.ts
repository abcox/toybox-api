import { ApiProperty } from "@nestjs/swagger";

export interface IBaseResponseMetaStatus {
    readonly message: string;
    readonly color: string;
}

export interface IBaseResponseMeta {
    readonly status: IBaseResponseMetaStatus;
}

export interface IBaseResponseError {
    readonly status: IBaseResponseMetaStatus;
}

export interface IBaseResponse {
    readonly meta: IBaseResponseMeta;
}

/* export interface SortMeta {
    direction: string;  // asc | desc
    name: string;       // i.e. field/column/property
    order: number;      // sequence
} */

// REQUEST

export interface IBaseRequestPagingOptions {
    start: number;
    limit: number;
}

export enum SortDirection {
    Ascending = 1,
    Descending = -1
}

export interface IBaseRequestSortingOption {
    name: string;
    direction: SortDirection;
}

export class Request<T> {
    @ApiProperty()
    filter: T;
    @ApiProperty()
    paging: IBaseRequestPagingOptions;
    @ApiProperty()
    sorting: IBaseRequestSortingOption[];
}

export interface Response<T> {
    items: Promise<T>;
    totalItems: number;
    // todo: explore this idea..
    /* meta: {
        request: Request<T>
    }; */
}
