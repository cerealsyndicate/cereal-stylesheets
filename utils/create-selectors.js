import getValues from "../helpers/get-values.js"
import escapeClassSeparator from "../helpers/escape-class.js"

const generateSelectors = (valuesArray, prefix, printProps, state={}, mq={}) => {
  let selectorString = '';

  const stateSeparator = state.separator ? escapeClassSeparator(state.separator) : ''
  const mqSeparator = mq.separator ? escapeClassSeparator(mq.separator) : ''
  const stateSuffix = state.value ? `${stateSeparator}${state.value}` : ''
  const mqSuffix = mq.value ? `${mqSeparator}${mq.value}` : ''
  const suffix = `${stateSuffix}${mqSuffix}`
  const statePseudo = state.value ? `:${state.value}` : ''
  
  for (const [key, value] of Object.entries(valuesArray)) {
    selectorString += `.${prefix}-${key}${suffix}${statePseudo} {\n`
    Object.values(printProps).forEach(prop => {
      selectorString += `\t${prop}: ${value};\n`
    })
    selectorString += `}\n`
  }

  return selectorString
}

const createAllClasses = (properties, {...mq}) => {
  let selectorString = ''

  // Loop through the properties
  properties.forEach(property => {
    Object.keys(property).forEach(key => {
      const propArray = property[key]
      const prefix = propArray.prefix

      const printProps = propArray.properties ?
        (typeof propArray.properties === 'string' ?
          [propArray.properties] :
          propArray.properties) :
        [key]

      const valuesArray = getValues(propArray.values)
      
      selectorString += generateSelectors(valuesArray, prefix, printProps, {}, {...mq})      
        if ('states' in propArray) {
          const statesArray = (typeof propArray.states === 'string') ? ['hover', 'focus', 'active'] : propArray.states

          for (const state of statesArray) {
            selectorString += generateSelectors(valuesArray, prefix, printProps, {value: state, separator: ':'}, {...mq})
          }
        }
    })
  })

  return selectorString
}

// Function to create selectors from properties
export default function createSelectors(props) {
  const {
    properties
  } = props;

  return createAllClasses(properties, {})
}
