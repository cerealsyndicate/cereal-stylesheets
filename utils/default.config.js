const defaultConfig = {
  outputDirectory: "./", // The directory where the output file will be saved. Defaults to the root directory of the project.

  outputFile: "output.css", // The name of the output file. Defaults to output.css.

  customPropertiesOnly: false, // If true overrides several other options, including rootCustomProperties

  rootCustomProperties: true, // Sets the default value for the addRoot value in settings objects. This can be overridden by individual settings objects’ addRoot value.

  mediaQueryClasses: true, // Sets the default value for the responsive value in properties objects. This can be overridden by individual properties objects’ responsive value.

  printQueryClasses: false, // Sets the default value for the print value in properties objects. This can be overridden by individual properties objects’ print value.

  minified: true, // If true, the output CSS will be minified.

  stateClasses: true, // If true, generates state classes for default properties, such as colors, text-decoration, border-color, and background-color. By default a provided settings object is used, but this can be overridden by individual properties objects with a stateClasses value. The state classes are an object containing a list of the desired states. These states must be valid pseudo-classes, not pseudo-elements.
}

export default defaultConfig
