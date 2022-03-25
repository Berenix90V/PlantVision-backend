export enum ErrorType {
    NOT_FOUND = "Not found",
    CONFLICT = "Already present",
}

export interface IError {
    error: ErrorType,
    message: string
}