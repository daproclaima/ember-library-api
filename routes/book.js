import Router from 'koa-router';
import {
  MODEL_NAME_BOOK,
} from '../constants/db/MODEL_NAMES'
import sequelize from 'sequelize';
import { ROUTE_NAME_BOOKS } from '../constants/ROUTE_NAMES'
import { CODE_201, CODE_204 } from '../constants/CODES'

/**
 * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
 */
const {Op} = sequelize;

const router = new Router();

const serialize = model => ({
  type: MODEL_NAME_BOOK,
  id: model.id,
  attributes: {
    isbn: model.isbn,
    title: model.title,
    'publish-date': model.publishDate,
  },
  links: {
    self: `${ROUTE_NAME_BOOKS}/${model.id}`
  }
})

/**
 * @function
 * @description returns array of all books or those matching query params
 * from the db
 */
router.get('/', async (context, next) => {
  let arrayBooks

  const query = context.query['filter[query]']
  const BookModel = context.app.db[MODEL_NAME_BOOK]

  let getBooks = async () => await BookModel.findAll()

  if(query) {
    getBooks = async () => await BookModel.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { isbn: { [Op.iLike]: `%${query}%` } },
        ]
      }
    })
  }

  arrayBooks = await getBooks()
  context.body = arrayBooks

  context.body = {data: arrayBooks.map(book => serialize(book))}
})

/**
 * @function
 * @description returns a book matching provided id
 */
router.get('/:id', async (context, next) => {
  const id = context.params.id

  const BookModel = context.app.db[MODEL_NAME_BOOK]
  const book = await BookModel.findOrFail({ where: {id} })

  context.body = { data: serialize(book)}
})

/**
 * @function
 * @description create a new book
 */
router.post('/', async (context, next) => {
  const attributes = context.request.body.data.attributes
  attributes.AuthorId = context.request.body.data.relationships.author.data.id
  attributes.publishDate = attributes['publish-date']

  context.body = attributes

  const BookModel = context.app.db[MODEL_NAME_BOOK]
  const book = await BookModel.create(attributes)

  context.status = CODE_201.code
  context.set('Location', `${ROUTE_NAME_BOOKS}/${book.id}`)
  context.body = { data: serialize(book) }
})

/**
 * @function
 * @description update a book attributes matching provided id
 */
router.patch('/:id', async (context, next) => {
  const id = context.params.id

  const attributes = context.request.body.data.attributes
  attributes.AuthorId = context.request.body.data.relationships.author.data.id
  attributes.publishDate = attributes['publish-date']

  const BookModel = context.app.db[MODEL_NAME_BOOK]
  const book = await BookModel.findOrFail({ where: {id} })

  book.set(attributes)
  await book.save()

  context.body = { data: serialize(book) }
})

/**
 * @function
 * @description delete a book matching provided id
 */
router.del('/:id', async (context, next) => {
  const id = context.params.id

  const BookModel = context.app.db[MODEL_NAME_BOOK]
  const book = await BookModel.findOrFail({ where: {id} })

  await book.destroy()

  context.status = CODE_204.code
  context.body = null
})

export default router.routes()
