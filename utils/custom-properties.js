export default function setCustomProperties(props) {
  let output = ''
  const { customPropertiesOnly, rootCustomProperties, settings } = props;
  if (rootCustomProperties || customPropertiesOnly) {
    output += `:root {\n`
    settings.forEach(setting => {
      Object.values(setting).forEach(subSetting => {
        const { prefix=null, values, addRoot=false } = subSetting;
        if (values && addRoot) {
          const setPrefix = prefix ? `${prefix}-` : ''
          Object.entries(values).forEach(([key, value]) => {
            output += `\t--${setPrefix}${key}: ${value};\n`
          });
        }
      });
    });
    output += `}\n\n`
  }
  return output
}
