import { MODEL_NAME_USER } from "../constants/db/MODEL_NAMES";
import { ROUTE_NAME_USERS } from "../constants/ROUTE_NAMES";

export default (model) => ({
  type: MODEL_NAME_USER,
  id: model.id,
  attributes: {
    email: model.email,
    username: model.username,
  },
});
