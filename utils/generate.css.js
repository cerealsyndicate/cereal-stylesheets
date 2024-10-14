import setCustomProperties from './custom-properties.js'
import createSelectors from './create-selectors.js'

export default function generateCSS(config) {
  let output = '';

  const {
    customPropertiesOnly,
    rootCustomProperties,
    mediaQueryClasses,
    stateClasses
  } = config;

  // Settings Array
  let settings = config.settings || {};
  if (!Array.isArray(settings)) {
    settings = [settings];
  }
  
  // Properties Array
  let properties = config.properties || {};
  if (!Array.isArray(properties)) {
    properties = [properties];
  }

  output += setCustomProperties({
    customPropertiesOnly,
    rootCustomProperties,
    settings,
    output
  })

  output += createSelectors({
    customPropertiesOnly,
    mediaQueryClasses,
    stateClasses,
    settings,
    properties
  })

  return output;
}