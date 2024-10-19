import fs from "fs"
import config from "./utils/load.config.js"
import generateCSS from "./utils/generate.css.js"

async function main() {
  const loadConfiguration = await config()
  const configuration = loadConfiguration

  // Check if the output directory ends with a slash and remove it if it does since it is added later
  function processOutputDir(dir) {
    if (dir.endsWith("/")) {
      // Recursive if someone got slash happy
      return processOutputDir(dir.slice(0, -1))
    }
    return dir
  }

  const outputDir = processOutputDir(configuration.outputDirectory)
  const outputFile = configuration.outputFile

  fs.mkdirSync(outputDir, { recursive: true })

  fs.writeFile(
    `${outputDir}/${outputFile}`,
    generateCSS(configuration),
    (err) => {
      if (err) throw err
      console.log("The file has been saved!")
    }
  )
}

main()
