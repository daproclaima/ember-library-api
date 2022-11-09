import book from './book'
import author from './author'
import review from './review'
const resources = {
  Book: book,
  Author: author,
  Review: review
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
