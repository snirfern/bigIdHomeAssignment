import logger from "../../infrastructure/logger/logger";

enum HttpStatusCode {
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
    CONFLICT = 409,
}

export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = HttpStatusCode.INTERNAL_SERVER) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
        logger.error(`message:\n${message}\nStackTrace:\n${this.stack}`)
    }
}


export class EntityAlreadyExists extends AppError {
    constructor(message: string) {
        super(message, HttpStatusCode.CONFLICT);
    }
}

export class EntityDoesNotExist extends AppError {
    constructor(message: string) {
        super(message, HttpStatusCode.NOT_FOUND);
    }
}

export class EntityCreationFailure extends AppError {
    constructor(message: string) {
        super(message, HttpStatusCode.BAD_REQUEST);
    }
}



