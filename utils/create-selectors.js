import getValues from "../helpers/get-values.js"
import escapeClassSeparator from "../helpers/escape-class.js"
import isTypeOf from "../helpers/is-typeof.js";

const generateSelectors = (valuesArray, prefix, printProps, state={}, mq={}) => {
  let selectorString = '';

  const stateSeparator = state.separator ? escapeClassSeparator(state.separator) : ''
  const mqSeparator = mq.separator ? escapeClassSeparator(mq.separator) : ''
  const stateSuffix = state.value ? `${stateSeparator}${state.value}` : ''
  const mqSuffix = mq.value ? `${mqSeparator}${mq.value}` : ''
  const suffix = `${stateSuffix}${mqSuffix}`
  const statePseudo = state.value ? `:${state.value}` : ''
  const tab = mq.value ? '\t' : ''
  
  for (const [key, value] of Object.entries(valuesArray)) {
    selectorString += `${tab}.${prefix}-${key}${suffix}${statePseudo} {\n`
    Object.values(printProps).forEach(prop => {
      selectorString += `${tab}${tab}${prop}: ${value};\n`
    })
    selectorString += `${tab}}\n`
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
      const responsive = propArray.responsive

      const printProps = propArray.properties ?
        (typeof propArray.properties === 'string' ?
          [propArray.properties] :
          propArray.properties) :
        [key]

      const valuesArray = getValues(propArray.values)

      const generator = () => {
        selectorString += generateSelectors(valuesArray, prefix, printProps, {}, {...mq})      
        if ('states' in propArray) {
          const statesArray = (typeof propArray.states === 'string') ? ['hover', 'focus', 'active'] : propArray.states
  
          for (const state of statesArray) {
            selectorString += generateSelectors(valuesArray, prefix, printProps, {value: state, separator: ':'}, {...mq})
          }
        }
      }

      if (mq.value === undefined) {
        generator()
      }

      const isMQArray = isTypeOf(responsive) === 'array'
      const hasOnlyExclusions = isMQArray ? responsive.every(item => item.startsWith('!')) : false

      if ((responsive || isMQArray) && mq.value !== undefined) {
        if (isMQArray) {
          responsive.forEach(item => {
            if (!hasOnlyExclusions) {
              if (item === mq.value && responsive.includes(mq.value)) {
                generator()
              }
            }
            else if (hasOnlyExclusions) {
              if (item != mq.value && !responsive.includes(`!${mq.value}`)) {
                generator()
              }
            }
          })
        }
      }

    })
  })

  return selectorString
}

// Function to create selectors from properties
export default function createSelectors(props) {
  const {
    mediaQueries,
    properties
  } = props;
  let classes = ''

  classes += createAllClasses(properties, {})

  if (mediaQueries.defineMediaQueries) {
    for (const [key, values] of Object.entries(mediaQueries.values)) {
      const {type, value, queryClass} = values
      if (queryClass) {
        const atMQ = () => {
          switch (type) {
            case 'min-width':
              return `@media (min-width: ${value})`
            case 'print':
              return `@media print`
            case 'range':
              return `@media (${value})`
            case 'custom':
              return `@media ${value}`
            default:
              return `@media (${type}: ${value})`
          }
        }

        classes += `${atMQ()} {\n`
        classes += `${createAllClasses(properties, {separator: '@', value: key})}`
        classes += `}\n`
      }
    }
  }

  return classes
}
