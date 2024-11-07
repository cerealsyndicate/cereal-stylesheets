import fs from "fs"
import path from "path"
import mqNormalizer from "./media-query.normalizer.js"
import mediaQueries from "./default.media-queries.js"
import state from "./state.js"
import defaultConfig from "./default.config.js"

const __dirname = path.dirname(new URL(import.meta.url).pathname)

function loadProperties() {
  const propertiesDir = path.resolve(__dirname, "../properties")
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
  const settingsDir = path.resolve(__dirname, "../settings")
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

async function config(configFilePath) {
  let userConfig = {}

  // Check if configFilePath is an object
  if (typeof configFilePath === "object") {
    userConfig = configFilePath
  } else {
    // Resolve the path and load the configuration file
    const configPath = configFilePath
      ? path.resolve(process.cwd(), configFilePath)
      : path.resolve(process.cwd(), "cereal.config.js")

    if (fs.existsSync(configPath)) {
      try {
        userConfig = (await import(configPath)).default
      } catch (error) {
        console.error(`Error loading configuration file: ${configPath}`, error)
        userConfig = {} // Ensure userConfig is an object even if import fails
      }
    } else {
      console.warn(
        `Optional configuration file ${
          configFilePath || "cereal.config.js"
        } not found in the project root.`
      )
    }
  }

  // Ensure userConfig is always an object
  userConfig = userConfig || {}

  const defaultConfigData = defaultConfig

  const properties = {
    ...defaultConfigData.properties,
    ...(userConfig.properties || loadProperties()),
  }

  const settings = {
    ...defaultConfigData.settings,
    ...(userConfig.settings || loadSettings()),
  }

  const normalizedMediaQueries = userConfig.mediaQueries
    ? mqNormalizer(userConfig.mediaQueries)
    : mqNormalizer(mediaQueries)

  const { values: _, ...restNormalizedMediaQueries } = normalizedMediaQueries

  const finalMediaQueries = {
    ...restNormalizedMediaQueries,
    values: normalizedMediaQueries.values,
  }

  state.add([
    {
      properties,
      settings,
      mediaQueries: finalMediaQueries,
    },
  ])

  return {
    ...defaultConfigData,
    ...userConfig,
    mediaQueries: finalMediaQueries,
    properties,
    settings,
  }
}

export default config
