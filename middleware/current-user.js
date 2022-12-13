import { MODEL_NAME_USER } from '../constants/db/MODEL_NAMES'
import jwt, { verify } from 'jsonwebtoken'
import { promisify } from 'util'
import UnauthorizedError from '../errors/unauthorized'

export default async (context, next) => {
  try {
    const authorizationHeader = context.header.authorization || ''

    const token = authorizationHeader.replace('Bearer ', '')

    const result = await verify(token, process.env.JWT_SECRET)

    context.currentUser = await context.app.db[MODEL_NAME_USER].findOrFail({
      where: {
        id: result.sub,
      },
    })
  } catch (error) {
    throw new UnauthorizedError()
  }

  return await next(context)
}
