import { mapKeys, mapValues } from 'lodash'
import { camelize, underscore } from 'inflected'

export default async (context, next) => {
  context.getAttributes = () => {
    let { data } = context.request.body
    let { attributes, relationships } = data

    attributes = mapKeys(attributes, (value, key) => camelize(underscore(key), false))
    relationships = mapKeys(relationships, (value, key) => camelize(underscore(`${key}-id`)))
    relationships = mapValues(relationships, (value) => value.data.id)

    return { ...attributes, ...relationships }
  }
  await next(context)
}
