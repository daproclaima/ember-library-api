import { MODEL_NAME_REVIEW } from '../constants/db/MODEL_NAMES'
import { ROUTE_NAME_REVIEWS } from '../constants/ROUTE_NAMES'

export default (model) => ({
  type: MODEL_NAME_REVIEW,
  id: model.id,
  attributes: {
    username: model.User.username,
    body: model.body,
    'created-at': model.createdAt,
  },
  links: {
    self: `${ ROUTE_NAME_REVIEWS }/${ model.id }`,
  },
  relationships: {
    book: {
      links: {
        related: `${ ROUTE_NAME_REVIEWS }/${ model.id }/book`,
      },
    },
  },
});
