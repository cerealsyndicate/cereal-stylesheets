#!/usr/bin/env node

import fs from "fs"
import path from "path"
import config from "./utils/load.config.js"
import generateCSS from "./utils/generate.css.js"

async function main() {
  // Parse command-line arguments
  const args = process.argv.slice(2)
  let outputArg = null
  let configFileArg = null

  args.forEach((arg, index) => {
    if (arg === "--output" && args[index + 1]) {
      outputArg = args[index + 1]
    }
    if (arg === "--config" && args[index + 1]) {
      configFileArg = args[index + 1]
    }
  })

  // Set a default value for configFileArg if not provided
  configFileArg = configFileArg || "cereal.config.js"

  const loadConfiguration = await config(configFileArg)
  const configuration = loadConfiguration

  // Set default values for outputDirectory and outputFile
  const outputDirectory = configuration.outputDirectory || "./"
  const outputFile = configuration.outputFile || "output.css"

  // Determine the output path and file
  let outputPath
  if (outputArg) {
    outputPath = path.resolve(process.cwd(), outputArg)
  } else {
    const outputDir = path.resolve(process.cwd(), outputDirectory)
    outputPath = path.join(outputDir, outputFile)
  }

  // Ensure the output directory exists
  const outputDir = path.dirname(outputPath)
  fs.mkdirSync(outputDir, { recursive: true })

  // Generate CSS content
  const cssContent = generateCSS(configuration)

  // Write the generated CSS to the output file
  fs.writeFile(outputPath, cssContent, (err) => {
    if (err) throw err
    console.log(`The file has been saved to ${outputPath}!`)
  })
}

main()
