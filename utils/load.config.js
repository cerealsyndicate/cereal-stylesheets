import fs from "fs"
import path from "path"
import defaultConfig from "./default.config.js"
import mediaQueries from "./default.media-queries.js"
import mqNormalizer from "./media-query.normalizer.js"
import state from "./state.js"

// Function to load properties from files in the properties folder
function loadProperties() {
  const propertiesDir = path.resolve(process.cwd(), "properties")
  const properties = {}

  if (fs.existsSync(propertiesDir)) {
    const files = fs.readdirSync(propertiesDir)

    files.forEach((file) => {
      const filePath = path.join(propertiesDir, file)
      if (fs.statSync(filePath).isFile() && path.extname(file) === ".json") {
        try {
          const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"))
          Object.assign(properties, fileContent)
        } catch (error) {
          console.error(`Error parsing JSON file: ${filePath}`, error)
        }
      }
    })
  } else {
    console.warn("Properties folder not found in the project root.")
  }

  return properties
}

// Function to load settings from files in the settings folder
function loadSettings() {
  const settingsDir = path.resolve(process.cwd(), "settings")
  const settings = {}

  if (fs.existsSync(settingsDir)) {
    const files = fs.readdirSync(settingsDir)

    files.forEach((file) => {
      const filePath = path.join(settingsDir, file)
      if (fs.statSync(filePath).isFile() && path.extname(file) === ".json") {
        try {
          const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"))
          Object.assign(settings, fileContent)
        } catch (error) {
          console.error(`Error parsing JSON file: ${filePath}`, error)
        }
      }
    })
  } else {
    console.warn("Settings folder not found in the project root.")
  }

  return settings
}

async function config() {
  const configPath = path.resolve(process.cwd(), "cereal.config.js")

  let userConfig = {}
  if (fs.existsSync(configPath)) {
    try {
      userConfig = (await import(configPath)).default
    } catch (error) {
      console.error(`Error loading configuration file: ${configPath}`, error)
    }
  } else {
    console.warn(
      "Optional configuration file cereal.config.js not found in the project root."
    )
  }

  const properties = loadProperties()
  const settings = loadSettings()

  const {
    properties: userProperties,
    settings: userSettings,
    mediaQueries: userMediaQueries,
    ...customUserConfig
  } = userConfig

  const finalProperties = {
    ...properties,
    ...userProperties,
  }

  const finalSettings = {
    ...settings,
    ...userSettings,
  }

  const normalizedMediaQueries = mqNormalizer(mediaQueries)
  const normalizedUserMediaQueries = mqNormalizer(userMediaQueries)

  // Destructure and exclude the `values` property
  const { values: _, ...restNormalizedMediaQueries } = normalizedMediaQueries
  const { values: __, ...restNormalizedUserMediaQueries } =
    normalizedUserMediaQueries

  const finalMediaQueries = {
    ...restNormalizedMediaQueries, // Spread the rest of the properties from normalizedMediaQueries
    ...restNormalizedUserMediaQueries, // Spread the rest of the properties from normalizedUserMediaQueries
    values: {
      ...normalizedUserMediaQueries.values, // Include the `values` property from normalizedUserMediaQueries
    },
  }

  state.add([
    {
      properties: finalProperties,
      settings: finalSettings,
      mediaQueries: finalMediaQueries,
    },
  ])

  return {
    ...defaultConfig,
    ...customUserConfig,
    mediaQueries: finalMediaQueries,
    properties: finalProperties,
    settings: finalSettings,
  }
}

export default config
