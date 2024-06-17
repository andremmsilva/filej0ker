import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

function validationMiddleware(
  type: any
): (req: Request, res: Response, next: NextFunction) => void {
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

export { validationMiddleware };
