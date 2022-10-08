import { CODE_404, CODE_500 } from '../constants/CODES'
import NotFoundError from './not-found'

export default async (context, next) => {
  try {
    await next()
  } catch (error) {
    switch (true) {
      case error instanceof NotFoundError:
        context.status = CODE_404.code
        return context.body = {
          errors: [
            {
              code: CODE_404.code,
              title: CODE_404.title,
              detail: `${error.modelName} with id ${error.id} not found.`
            }
          ]
        }
      default:
        context.status = CODE_500.code
        return context.body = {
          errors: [
            {
              code: CODE_500.code,
              title: CODE_500.title,
              detail: error.message
            }
          ]
        }
    }
  }
}
