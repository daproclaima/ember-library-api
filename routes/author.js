import Router from "koa-router";
import {
  MODEL_NAME_AUTHOR,
  MODEL_NAME_BOOK,
} from "../constants/db/MODEL_NAMES";
import { CODE_201, CODE_204 } from "../constants/CODES";
import { ROUTE_NAME_AUTHORS } from "../constants/ROUTE_NAMES";
import sequelize from "sequelize";

/**
 * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
 */
const { Op } = sequelize;

const router = new Router();

/**
 * @function
 * @description returns array of all authors or those matching query params
 * from db
 */
router.get("/", async (context, next) => {
  let arrayAuthors;

  const query = context.query["filter[query]"];
  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR];

  let getAuthors = async () => await AuthorModel.findAll();

  if (query) {
    getAuthors = async () =>
      await AuthorModel.findAll({
        where: {
          [Op.or]: [
            { lastName: { [Op.iLike]: `%${query}%` } },
            { firstName: { [Op.iLike]: `%${query}%` } },
          ],
        },
      });
  }

  arrayAuthors = await getAuthors();

  context.body = context.app.serialize(MODEL_NAME_AUTHOR, arrayAuthors);
});

/**
 * @function
 * @description returns an author matching provided id
 */
router.get("/:id", async (context, next) => {
  const id = context.params.id;

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR];
  const author = await AuthorModel.findOrFail({ where: { id } });

  context.body = context.app.serialize(MODEL_NAME_AUTHOR, author);
});

/**
 * @function
 * @description returns the book of the author matching provided id
 */
router.get("/:id/books", async (context, next) => {
  const id = context.params.id;

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR];
  const author = await AuthorModel.findOrFail({ where: { id } });
  const arrayBooks = await author.getBooks();

  context.body = context.app.serialize(MODEL_NAME_BOOK, arrayBooks);
});

/**
 * @function
 * @description create a new author
 */
router.post("/", async (context, next) => {
  const attributes = context.getAttributes();

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR];
  const author = await AuthorModel.create(attributes);

  context.status = CODE_201.code;
  context.set("Location", `${ROUTE_NAME_AUTHORS}/${author.id}`);
  context.body = context.app.serialize(MODEL_NAME_AUTHOR, author);
});

/**
 * @function
 * @description update an author attributes matching provided id
 */
router.patch("/:id", async (context, next) => {
  const attributes = context.getAttributes();

  const id = context.params.id;

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR];
  const author = await AuthorModel.findOrFail({ where: { id } });

  const data = {
    firstName: attributes.firstName || author.firstName,
    lastName: attributes.lastName || author.lastName,
  };

  author.set(data);
  await author.save();

  context.body = context.app.serialize(MODEL_NAME_AUTHOR, author);
});

/**
 * @function
 * @description delete an author matching provided id
 */
router.del("/:id", async (context, next) => {
  const id = context.params.id;

  const AuthorModel = context.app.db[MODEL_NAME_AUTHOR];
  const author = await AuthorModel.findOrFail({ where: { id } });

  await author.destroy();

  context.status = CODE_204.code;
  context.body = null;
});

export default router.routes();
