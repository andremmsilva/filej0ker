import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

function validateBody(
  type: any
): (req: Request<any>, res: Response<any>, next: NextFunction) => void {
  return (req, res, next) => {
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints ?? {}))
          .flat();
        res.status(400).json({ errors: errorMessages });
      } else {
        next();
      }
    });
  };
}

function validateParams(
  type: any
): (req: Request<any>, res: Response<any>, next: NextFunction) => void {
  return (req, res, next) => {
    const dtoObj = plainToInstance(type, req.params);
    validate(dtoObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints ?? {}))
          .flat();
        res.status(400).json({ errors: errorMessages });
      } else {
        next();
      }
    });
  };
}

export { validateBody, validateParams };
