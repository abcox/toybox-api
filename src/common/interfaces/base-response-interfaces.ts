export interface BaseResponseMetaStatus {
    readonly message: string;
    readonly color: string;
}

export interface BaseResponseMeta {
    readonly status: BaseResponseMetaStatus;
}

export interface BaseResponseError {
    readonly status: BaseResponseMetaStatus;
}

export interface BaseResponse {
    readonly meta: BaseResponseMeta;
}

/* export interface SortMeta {
    direction: string;  // asc | desc
    name: string;       // i.e. field/column/property
    order: number;      // sequence
} */

// REQUEST

export interface BaseRequestPagingOptions {
    start: number;
    limit: number;
}

export enum SortDirection {
    Ascending = 1,
    Descending = -1
}

export interface BaseRequestSortingOption {
    name: string;
    direction: SortDirection;
}

export interface BaseRequestOptions {
    paging: BaseRequestPagingOptions;
    sorting: BaseRequestSortingOption[];
}
