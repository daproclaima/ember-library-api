import { CODE_404, CODE_500 } from "../constants/CODES";
import NotFoundError from "./not-found";
import { ValidationError, UniqueConstraintError } from "sequelize";
import { dasherize, underscore } from "inflected";

export default async (context, next) => {
  try {
    await next();
  } catch (error) {
    debugger;
    switch (error.constructor) {
      case NotFoundError:
        context.status = CODE_404.code;
        context.body = {
          errors: [
            {
              code: CODE_404.code,
              title: CODE_404.title,
              detail: `${error.modelName} with id ${error.id} not found.`,
            },
          ],
        };
        break;

      case ValidationError:
      case UniqueConstraintError:
        context.status = 422;
        context.body = {
          errors: error.errors.map((errorValue) => {
            const attribute = dasherize(underscore(errorValue.path));
            const title =
              errorValue.validatorKey === "notEmpty"
                ? `${attribute} can't be blank`
                : errorValue.message;

            return {
              status: 422,
              code: 100,
              title,
              source: {
                pointer: `/data/attributes/${attribute}`,
              },
            };
          }),
        };
        break;

      default:
        context.status = CODE_500.code;
        context.body = {
          errors: [
            {
              code: CODE_500.code,
              title: CODE_500.title,
              detail: error.message,
            },
          ],
        };
    }

    return context;
  }
};
