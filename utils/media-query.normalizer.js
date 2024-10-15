export default function mqNormalizer(obj) {
  const normalizedObj = { ...obj };

  const startsWithNumber = (str) => {
    return /^\d/.test(str);
  }

  const acceptableValue = (str) => {
    return startsWithNumber(str) || str === 'print' || str === 'screen'
  }

  // Check if values exists and is an object
  if (normalizedObj.values && typeof normalizedObj.values === 'object') {
    for (const [key, value] of Object.entries(normalizedObj.values)) {
      if (typeof value === 'string') {
        if (acceptableValue(value)) {
          normalizedObj.values[key] = {
            type: startsWithNumber(value) ? 'min-width' : 'custom',
            queryClass: true,
            value: value
          }
        } else {
          delete normalizedObj.values[key]
        }
      }
    }
  } else {
    console.error('The values property is missing or is not an object.')
  }

  return normalizedObj
}