import book from './book'
import author from './author'
const resources = {
  Book: book,
  Author: author
}

export default function serialize(type, model) {
  const resource = resources[type]
  let callBack = () => resource(model)

  if(Array.isArray(model)) {
    callBack = () => model.map(resource)
  }

  let data = callBack()

  return {data}
}
