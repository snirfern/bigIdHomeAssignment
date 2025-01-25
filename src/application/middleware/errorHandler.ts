import { NextFunction, Request, Response } from 'express';
import {AppError} from "../../domain/errrors/errors";
import logger from "../../infrastructure/logger/logger";


const errorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    let { message, statusCode } = err as AppError;

    if (!(err instanceof AppError)) {
        message = 'Internal Server Error';
        statusCode = 500;
    }

    logger.error(`Error: ${err}`);

    res.status(statusCode).json({
        status: 'error',
        message,
    });

    return next(err);
};

export default errorHandler;
