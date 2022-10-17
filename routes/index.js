import Router from 'koa-router'

import status from './status'
import author from './author'
import book from './book'

import { ROUTE_NAME_AUTHORS, ROUTE_NAME_BOOKS } from '../constants/ROUTE_NAMES'

const router = new Router()

router.use('/', status)
router.use(ROUTE_NAME_AUTHORS, author)
router.use(ROUTE_NAME_BOOKS, book)

export default router

