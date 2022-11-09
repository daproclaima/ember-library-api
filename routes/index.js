import Router from 'koa-router'

import status from './status'
import author from './author'
import book from './book'
import review from './review'

import { ROUTE_NAME_AUTHORS, ROUTE_NAME_BOOKS, ROUTE_NAME_REVIEWS } from '../constants/ROUTE_NAMES'

const router = new Router()

router.use('/', status)
router.use(ROUTE_NAME_AUTHORS, author)
router.use(ROUTE_NAME_BOOKS, book)
router.use(ROUTE_NAME_REVIEWS, review)

export default router

