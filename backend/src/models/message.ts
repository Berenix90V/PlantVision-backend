export enum MessageType {
    NOT_FOUND = "Not found",
    CONFLICT = "Already present",
    OK = "OK"
}

export interface IMessage {
    type: MessageType,
    message: string
}