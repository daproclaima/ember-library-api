import Router from "koa-router";

import status from "./status";
import author from "./author";
import book from "./book";
import review from "./review";
import user from "./user";
import session from "./session";

import {
  ROUTE_NAME_AUTHORS,
  ROUTE_NAME_BOOKS,
  ROUTE_NAME_REVIEWS, ROUTE_NAME_SESSION,
  ROUTE_NAME_USERS,
} from '../constants/ROUTE_NAMES'

const router = new Router();

router.use("/", status);
router.use(ROUTE_NAME_AUTHORS, author);
router.use(ROUTE_NAME_BOOKS, book);
router.use(ROUTE_NAME_REVIEWS, review);
router.use(ROUTE_NAME_USERS, user);
router.use(ROUTE_NAME_SESSION, session);

export default router;
