export default function setCustomProperties(props) {
  let output = ""
  const tab = "\t"
  const nl = "\n"
  const { customPropertiesOnly, rootCustomProperties, settings } = props
  if (rootCustomProperties || customPropertiesOnly) {
    output += `:root {${nl}`
    settings.forEach((setting) => {
      Object.values(setting).forEach((subSetting) => {
        const { prefix = null, values, addRoot = false } = subSetting
        if (values && addRoot) {
          const setPrefix = prefix ? `${prefix}-` : ""
          Object.entries(values).forEach(([key, value]) => {
            output += `${tab}--${setPrefix}${key}: ${value};${nl}`
          })
        }
      })
    })
    output += `}${nl}${nl}`
  }
  return output
}
