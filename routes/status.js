import Router from "koa-router";

const router = new Router();

router.get("/", async (context, next) => {
  context.body = {
    status: "ok",
  };
});

export default router.routes();
