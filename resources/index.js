import Book from "./book";
import Author from "./author";
import Review from "./review";
import User from "./user";

const resources = {
  Book,
  Author,
  Review,
  User,
};

export default function serialize(type, model) {
  const resource = resources[type];
  let callBack = () => resource(model);

  if (Array.isArray(model)) {
    callBack = () => model.map(resource);
  }

  let data = callBack();

  return { data };
}
