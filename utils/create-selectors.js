export default function createSelectors(props) {
const {
  customPropertiesOnly,
  useLogicalProperties,
  mediaQueryClasses,
  stateClasses,
  settings,
  properties
} = props;

let cssContent = '';

// Getting Settings
const getSettings = (key) => {
  const setting = settings.find(setting => setting[key])
  return setting ? setting[key] : null
}

// Boolean check if the string is a reference to a settings object
const isStringArray = (str) => {
  return (typeof str === 'string' && str.startsWith('...'))
}

// A typeof function that also checks if the value is an array
const isTypeOf = (str) => {
  if (Array.isArray(str)) {
    return 'array'
  } else {
    return typeof str
  }
}

// This function takes in the `values` value of a property.
// It will return an object that can then be iterated over to create the CSS
const getValues = (str) => {
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

// Loop through the properties
properties.forEach(property => {
  let selectorString = '';

  Object.keys(property).forEach(key => {
    const propArray = property[key];

    const prefix = propArray.prefix;

    const responsive = propArray.responsive

    const printProps = propArray.properties ?
      (typeof propArray.properties === 'string' ?
        [propArray.properties] :
        propArray.properties) :
      [key];

    const valuesArray = getValues(propArray.values)
    
    for (const [key, value] of Object.entries(valuesArray)) {
      selectorString += `.${prefix}-${key} {\n`
      Object.values(printProps).forEach(prop => {
        selectorString += `\t${prop}: ${value};\n`
      })
      selectorString += `}\n`
    }
  })

  cssContent += selectorString
})

return cssContent;
}
