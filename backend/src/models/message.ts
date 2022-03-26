export enum MessageType {
    NOT_FOUND = "Not found",
    CONFLICT = "Already present",
    OK = "OK"
}

export interface IMessage {
    type: MessageType,
    message: string
}

export const success = (message: string): IMessage => {
    return {
        type: MessageType.OK,
        message: message
    }
}

export const not_found = (message: string): IMessage => {
    return {
        type: MessageType.NOT_FOUND,
        message: message
    }
}

export const conflict = (message: string): IMessage => {
    return {
        type: MessageType.CONFLICT,
        message: message
    }
}