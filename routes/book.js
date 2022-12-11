import Router from "koa-router";
import {
  MODEL_NAME_AUTHOR,
  MODEL_NAME_BOOK,
  MODEL_NAME_REVIEW,
} from "../constants/db/MODEL_NAMES";
import sequelize from "sequelize";
import { ROUTE_NAME_BOOKS } from "../constants/ROUTE_NAMES";
import { CODE_201, CODE_204 } from "../constants/CODES";
import currentUser from '../middleware/current-user'

/**
 * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
 */
const { Op } = sequelize;

const includeUser = {include: ['User']}

const router = new Router();

/**
 * @function
 * @description returns array of all books or those matching query params
 * from the db
 */
router.get("/", async (context, next) => {
  let arrayBooks;

  const query = context.query["filter[query]"];
  const BookModel = context.app.db[MODEL_NAME_BOOK];

  let getBooks = async () => await BookModel.findAll(includeUser);

  if (query) {
    getBooks = async () =>
      await BookModel.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } },
            { isbn: { [Op.iLike]: `%${query}%` } },
          ],
        },
        ...includeUser
      });
  }

  arrayBooks = await getBooks();

  context.body = context.app.serialize(MODEL_NAME_BOOK, arrayBooks);
});

/**
 * @function
 * @description returns a book matching provided id
 */
router.get("/:id", async (context, next) => {
  const id = context.params.id;

  const BookModel = context.app.db[MODEL_NAME_BOOK];
  const book = await BookModel.findOrFail({ where: { id }, ...includeUser});

  context.body = context.app.serialize(MODEL_NAME_BOOK, book);
});

/**
 * @function
 * @description returns the author of the book matching provided id
 */
router.get("/:id/author", async (context, next) => {
  const id = context.params.id;

  const BookModel = context.app.db[MODEL_NAME_BOOK];
  const book = await BookModel.findOrFail({ where: { id } });
  const author = await book.getAuthor(includeUser);

  context.body = context.app.serialize(MODEL_NAME_AUTHOR, author);
});

/**
 * @function
 * @description returns the reviews of the book matching provided id
 */
router.get("/:id/reviews", async (context, next) => {
  const id = context.params.id;

  const BookModel = context.app.db[MODEL_NAME_BOOK];
  const book = await BookModel.findOrFail({ where: { id } });
  const arrayReviews = await book.getReviews(includeUser);

  context.body = context.app.serialize(MODEL_NAME_REVIEW, arrayReviews);
});

/**
 * @function
 * @description create a new book
 */
router.post("/", currentUser, async (context, next) => {
  const attributes = context.getAttributes();
  attributes.UserId = context.currentUser.id

  const BookModel = context.app.db[MODEL_NAME_BOOK];
  const book = await BookModel.create(attributes);

  book.User = context.currentUser

  context.status = CODE_201.code;
  context.set("Location", `${ROUTE_NAME_BOOKS}/${book.id}`);
  context.body = context.app.serialize(MODEL_NAME_BOOK, book);
});

/**
 * @function
 * @description update a book attributes matching provided id
 */
router.patch("/:id", async (context, next) => {
  const attributes = context.getAttributes();

  const id = context.params.id;

  const BookModel = context.app.db[MODEL_NAME_BOOK];
  const book = await BookModel.findOrFail({ where: { id }, ...includeUser });

  book.set(attributes);
  await book.save();

  context.body = context.app.serialize(MODEL_NAME_BOOK, book);
});

/**
 * @function
 * @description delete a book matching provided id
 */
router.del("/:id", async (context, next) => {
  const id = context.params.id;

  const BookModel = context.app.db[MODEL_NAME_BOOK];
  const book = await BookModel.findOrFail({ where: { id } });

  await book.destroy();

  context.status = CODE_204.code;
  context.body = null;
});

export default router.routes();
