import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-body-parser'
import cors from '@koa/cors'

import config from './config/app'
import router from './routes/index'
import db from './models/index'

const app = new Koa()
app.db = db

app.use(logger())
app.use(cors())
app.use(bodyParser())

app.use(router.allowedMethods())
app.use(router.routes())

app.listen(config.port, () => {
  console.log(`Server listening on PORT ${config.port}`)
})
