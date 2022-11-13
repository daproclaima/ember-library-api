import Router from "koa-router";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { MODEL_NAME_USER } from "../constants/db/MODEL_NAMES";
import currentUser from '../middleware/current-user'

const hash = promisify(bcrypt.hash);

const router = new Router();

router.post("/", async (context) => {
  const attributes = context.getAttributes();
  attributes.passwordHash = await hash(attributes.password, 10);

  const UserModel = context.app.db[MODEL_NAME_USER];
  const user = await UserModel.create(attributes);

  context.body = context.app.serialize(MODEL_NAME_USER, user);
});

router.get('/me', currentUser, async context => {
  context.body = context.app.serialize(MODEL_NAME_USER, context.currentUser)
})

export default router.routes();
