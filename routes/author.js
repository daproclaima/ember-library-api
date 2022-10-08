import Router from 'koa-router'
import { MODEL_NAME_AUTHOR } from '../constants/db/MODEL_NAMES'
import { CODE_201, CODE_204 } from '../constants/CODES'
import { ROUTE_NAME_AUTHORS } from '../constants/ROUTE_NAMES'

const router = new Router()

const serialize = model => ({
  type: 'authors',
  id: model.id,
  attributes: {
    firstName: model.firstName,
    lastName: model.lastName,
  },
  links: {
    self: `${ROUTE_NAME_AUTHORS}/${model.id}`
  }
})

/**
 * @function
 * @description returns array of all authors in db
 */
router.get('/', async (context, next) => {
  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR]
  const arrayAuthors = await AuthorModel.findAll()

  context.body = {data: arrayAuthors.map(author => serialize(author))}
})

/**
 * @function
 * @description returns an author by provided id
 */
router.get('/:id', async (context, next) => {
  const id = context.params.id

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR]
  const author = await AuthorModel.findOrFail({where: {id}})

  context.body = { data: serialize(author)}
})

/**
 * @function
 * @description create a new author
 */
router.post('/', async (context, next) => {
  const attributes = context.request.body.data.attributes

  context.body = attributes

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR]
  const author = await AuthorModel.create(attributes)

  context.status = CODE_201.code
  context.set('Location', `${ROUTE_NAME_AUTHORS}/${author.id}`)
  context.body = { data: serialize(author) }
})

/**
 * @function
 * @description update an author attributes when author found by provided id
 */
router.patch('/:id', async (context, next) => {
  const id = context.params.id
  const attributes = context.request.body.data.attributes

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR]
  const author = await AuthorModel.findOrFail({where:{id}})

  const data = {
    firstName: attributes.firstName || author.firstName,
    lastName: attributes.lastName || author.lastName,
  }

  author.set(data)
  await author.save()

  context.body = { data: serialize(author) }
})

/**
 * @function
 * @description delete an author by provided id
 */
router.del('/:id', async (context, next) => {
  const id = context.params.id

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR]
  const author = await AuthorModel.findOrFail({where:{id}})

  await author.destroy()

  context.status = CODE_204.code
  context.body = null
})

export default  router.routes()
