import Router from 'koa-router'

import status from './status'
import author from './author'

import {ROUTE_NAME_AUTHORS} from '../constants/ROUTE_NAMES'

const router = new Router()

router.use(ROUTE_NAME_AUTHORS, author)
router.use('/', status)

export default router

