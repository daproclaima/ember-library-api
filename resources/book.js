import { MODEL_NAME_BOOK } from "../constants/db/MODEL_NAMES";
import { ROUTE_NAME_BOOKS } from "../constants/ROUTE_NAMES";

export default (model) => ({
  type: MODEL_NAME_BOOK,
  id: model.id,
  attributes: {
    isbn: model.isbn,
    title: model.title,
    "publish-date": model.publishDate,
    username: model.User.username,
  },
  links: {
    self: `${ROUTE_NAME_BOOKS}/${model.id}`,
  },
  relationships: {
    author: {
      links: {
        related: `/books/${model.id}/author`,
      },
    },
    reviews: {
      links: {
        related: `/books/${model.id}/reviews`,
      },
    },
  },
});
