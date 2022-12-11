import Router from "koa-router";
import {
  MODEL_NAME_BOOK,
  MODEL_NAME_REVIEW,
} from "../constants/db/MODEL_NAMES";
import { ROUTE_NAME_REVIEWS } from "../constants/ROUTE_NAMES";
import { CODE_201, CODE_204 } from "../constants/CODES";
import currentUser from '../middleware/current-user'

const includeUser = {include: ['User']}

const router = new Router();

/**
 * @function
 * @description returns array of all reviews or those matching query params
 * from the db
 */
router.get("/", async (context, next) => {
  let arrayReviews;
  const ReviewModel = context.app.db[MODEL_NAME_REVIEW];

  let getReviews = async () => await ReviewModel.findAll(includeUser);


  arrayReviews = await getReviews();

  context.body = context.app.serialize(MODEL_NAME_REVIEW, arrayReviews);
});

/**
 * @function
 * @description returns a review matching provided id
 */
router.get("/:id", async (context, next) => {
  const id = context.params.id;

  const ReviewModel = context.app.db[MODEL_NAME_REVIEW];
  const review = await ReviewModel.findOrFail({ where: { id }, ...includeUser });

  context.body = context.app.serialize(MODEL_NAME_REVIEW, review);
});

/**
 * @function
 * @description returns the book of the review matching provided id
 */
router.get("/:id/book", async (context, next) => {
  const id = context.params.id;

  const ReviewModel = context.app.db[MODEL_NAME_REVIEW];
  const review = await ReviewModel.findOrFail({ where: { id } ,});
  const book = await review.getBook(includeUser);

  context.body = context.app.serialize(MODEL_NAME_BOOK, book);
});

/**
 * @function
 * @description create a new review
 */
router.post("/", currentUser, async (context, next) => {
  const attributes = context.getAttributes();
  attributes.UserId = context.currentUser.id

  const ReviewModel = context.app.db[MODEL_NAME_REVIEW];
  const review = await ReviewModel.create(attributes);
  review.User = context.currentUser

  context.status = CODE_201.code;
  context.set("Location", `${ROUTE_NAME_REVIEWS}/${review.id}`);
  context.body = context.app.serialize(MODEL_NAME_REVIEW, review);
});

/**
 * @function
 * @description update a review attributes matching provided id
 */
router.patch("/:id", async (context, next) => {
  const attributes = context.getAttributes();

  const id = context.params.id;

  const ReviewModel = context.app.db[MODEL_NAME_REVIEW];
  const review = await ReviewModel.findOrFail({ where: { id }, ...includeUser });

  review.set(attributes);
  await review.save();

  context.body = context.app.serialize(MODEL_NAME_REVIEW, review);
});

/**
 * @function
 * @description delete a review matching provided id
 */
router.del("/:id", async (context, next) => {
  const id = context.params.id;

  const ReviewModel = context.app.db[MODEL_NAME_REVIEW];
  const review = await ReviewModel.findOrFail({ where: { id } });

  await review.destroy();

  context.status = CODE_204.code;
  context.body = null;
});

export default router.routes();
