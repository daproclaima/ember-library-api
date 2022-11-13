import { CODE_401, CODE_404, CODE_500 } from '../constants/CODES'
import NotFoundError from './not-found'
import { ValidationError, UniqueConstraintError } from 'sequelize'
import { dasherize, underscore } from 'inflected'
import UnauthorizedError from './unauthorized'

export default async (context, next) => {
  try {
    await next()
  } catch (error) {
    switch (true) {
      case error instanceof UnauthorizedError:
        context.status = 401
        context.body = {
          errors: [
            {
              ...CODE_401,
              detail: error.message,
            },
          ],
        }
        break

      case error instanceof NotFoundError:
        context.status = CODE_404.code
        context.body = {
          errors: [
            {
              code: CODE_404.code,
              title: CODE_404.title,
              detail: `${ error.modelName } with id ${ error.id } not found.`,
            },
          ],
        }
        break

      case error instanceof ValidationError:
      case error instanceof UniqueConstraintError:
        context.status = 422
        context.body = {
          errors: error.errors.map((errorValue) => {
            const attribute = dasherize(underscore(errorValue.path))
            const title =
              errorValue.validatorKey==='notEmpty'
                ? `${ attribute } can't be blank`
                :errorValue.message

            return {
              status: 422,
              code: 100,
              title,
              source: {
                pointer: `/data/attributes/${ attribute }`,
              },
            }
          }),
        }
        break

      default:
        context.status = CODE_500.code
        context.body = {
          errors: [
            {
              code: CODE_500.code,
              title: CODE_500.title,
              detail: error.message,
            },
          ],
        }
    }

    return context
  }
};
