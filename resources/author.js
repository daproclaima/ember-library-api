import { MODEL_NAME_AUTHOR } from '../constants/db/MODEL_NAMES'
import { ROUTE_NAME_AUTHORS } from '../constants/ROUTE_NAMES'

export default model => ({
  type: MODEL_NAME_AUTHOR,
  id: model.id,
  attributes: {
    firstName: model.firstName,
    lastName: model.lastName,
  },
  links: {
    self: `${ROUTE_NAME_AUTHORS}/${model.id}`
  },
  relationships: {
    books: {
      links: {
        related: `/authors/${model.id}/books`
      }
    }
  }
})
