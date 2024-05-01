import { Ajv, JSONSchemaType, ValidateFunction, ErrorObject } from 'ajv';
import { Request, Response, NextFunction } from 'express';
import { CODES } from '../../utils/errors/codes.js';
import { HttpError } from '../../utils/errors/httpError.js';
import { MESSAGES } from '../../utils/errors/messages.js';

export enum RequestSource {
  body = 'body',
  query = 'query',
  params = 'params',
}

export interface ValidateOptions {
  coerceTypes: boolean;
}

/**
 * Returns a callback to function as middleware that validates the current request against a given schema, store validated data in locals
 * @param schema - the schema to validate the request against
 * @param source - the source of validation: body, params, query (default: body)
 */
export function requestValidator<T>(
  schema: JSONSchemaType<T>,
  source = RequestSource.body,
  options: ValidateOptions = { coerceTypes: false },
) {
  return (request: Request, response: Response, next: NextFunction) => {
    const validateFunction = new Ajv(options).compile<T>(schema);
    validateRequestAgainstSchema<T>(request, response, next, validateFunction, source);
  };
}

/**
 * Validate a request against a {@link Joi.AnySchema}
 * @param request
 * @param response
 * @param next
 * @param schema
 * @param source
 */
function validateRequestAgainstSchema<T>(
  request: Request,
  response: Response,
  next: NextFunction,
  validate: ValidateFunction<T>,
  source: RequestSource,
) {
  const isValid = validate(request[source]);
  if (!isValid && validate.errors) {
    return next(new HttpError(parseErrorsMessages(validate.errors), CODES.BAD_REQUEST, 400));
  }

  return next();
}

function parseErrorsMessages(validationErrors: ErrorObject[]): string {
  const errorsMessages = validationErrors.map(
    (error) => `${error.instancePath ? error.instancePath + ' ' : ''}${error.message}`,
  );
  return errorsMessages?.length ? errorsMessages.join(', ') : MESSAGES.VALIDATION_ERROR;
}
