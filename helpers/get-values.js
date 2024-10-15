import isStringArray from "../helpers/is-string-array.js"
import isTypeOf from "../helpers/is-typeof.js"
import getSettings from "../helpers/get-settings.js"

export default function getValues(str) {

  let finalValues = {}

  if (isTypeOf(str) === 'array') {
    str.forEach(item => {
      if (isStringArray(item)) {
        Object.assign(finalValues, getValues(item))
      } else {
        finalValues[item] = item
      }
    })
  }
  
  else if (isTypeOf(str) === 'object') {
    return str
  }

  else if (isStringArray(str)) {
    const obj = str.slice(3)
    return getValues(getSettings(obj).values)
  }

  return finalValues
}
