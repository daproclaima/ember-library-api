import Router from 'koa-router'
import { MODEL_NAME_USER } from '../constants/db/MODEL_NAMES'
import UnauthorizedError from '../errors/unauthorized'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import bcrypt from 'bcrypt'
import NotFoundError from '../errors/not-found'

const sign = promisify(jwt.sign)

const router = new Router()

router.post('/', async (context, next) => {
  const { email, password } = context.request.body

  try {
    const UserModel = context.app.db[MODEL_NAME_USER]

    const user = await UserModel.findByEmail(email)

    const data = {
      id: user.id,
      email: user.email,
      username: user.username,
    }

    if (!await bcrypt.compare(password, user.passwordHash)) {
      throw new UnauthorizedError()
    }

    const token = await sign({
      data,
      sub: user.id,
    }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    })

    context.body = {
      token,
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      // needed to slower the response when email is found. Otherwise a hacker
      // knows an email was found since bcrypt.compare was executed while it
      // takes long
      await bcrypt.hash(password, 10)
    }
    throw new UnauthorizedError('Error logging in user with that email and password')
  }
})

export default router.routes()
